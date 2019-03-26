from __future__ import print_function
import logging
import os
import sys
import time
from collections import Counter

import requests
from ratelimit import limits, sleep_and_retry

HOME_DIR = os.environ['HOME']
UTILS_DIR = HOME_DIR + '/devrel-tools/utilities'
sys.path.append(UTILS_DIR)
import utils

### LOGGING ####################################################################
logger = logging.getLogger(__name__)
utils.configure_logger(logger, name=os.path.splitext(os.path.basename(__file__))[0], console_output=True)
################################################################################

@sleep_and_retry
@limits(calls=27, period=10)
def call_api(endpoint, params=None):
    """Submits a GET request to the Meetup API and returns an instance of
    requests.models.Response (not JSON), unless the response status code is 4xx
    or 5xx, in which case it raises requests.exceptions.HTTPError.

    If this function is called more times than are allowed within the time
    period specified by @limits, it sleeps the current thread until the time
    period has ellapsed, and then retries.
    
    Args:
        endpoint (str): Endpoint starting with '/', e.g., "/find/groups".
        params (dict): Optional; API key does not need to be passed if there are
            no other request parameters.

    Returns:
        requests.models.Response

    Raises:
        KeyError: if MEETUP_API_KEY is not an environmental variable.
        requests.exceptions.HTTPError: if response status code is 4xx or 5xx.
    """
    def merge_two_dicts(x, y):
        """Given two dicts, merge them into a new dict as a shallow copy."""
        if not y:
            return x
        z = x.copy()
        z.update(y)
        return z

    base_url = "https://api.meetup.com"
    request_url = base_url + endpoint
    
    try:
        MEETUP_API_KEY = os.environ['MEETUP_API_KEY']
    except KeyError:
        logger.error("Remember to `source secrets.sh`!")
        raise
    key_param = {"key": MEETUP_API_KEY}
    request_params = merge_two_dicts(key_param, params)

    response = requests.get(request_url,
                            params=request_params)
    logger.debug(response.url)
    logger.debug("Status Code: " + str(response.status_code))
    logger.debug(response.content[:250])
    logger.debug("X-RateLimit-Remaining: " + str(response.headers.get("X-RateLimit-Remaining")))
    logger.debug("X-RateLimit-Reset: " + str(response.headers.get("X-RateLimit-Reset")))

    response.raise_for_status()
    return response


def find_groups(zipcode, search_term):
    """By default, this function returns groups in Meetup's Tech category (34),
    narrowed by search term and proximity to zip code."""
    endpoint = "/find/groups"
    params = {"zip": zipcode,
              "radius": "smart",
              "category": "34",  # Tech
              "fields": "plain_text_description",
              "text": search_term,
              "order": "most_active"}
    response = call_api(endpoint, params)
    groups = response.json()
    return groups


def is_itinerant(group_urlname, threshold=.67):
    """For a given Meetup group, retrieves upcoming and past events in a six
    month range. If the group met at its most common venue less than `threshold`
    percentage of the time, return True."""

    endpoint = "/2/events"
    params = {"group_urlname": group_urlname,
              "status": "upcoming,past",
              "time": "-3m,3m",
              "desc": "true"}
    response = call_api(endpoint, params)
    response = response.json()
    # v2 endpoints nest results.
    results = response["results"]

    # If the group didn't have at least two events in our six month span, fail fast.
    if len(results) <= 2:
        return False

    venue_ids = list()
    for result in results:
        try:
            venue_ids.append(result["venue"]["id"])
        except KeyError:
            # If the event doesn't have a venue id, skip it.
            continue
    count = Counter(venue_ids)
    # If we didn't get any venue ids, fail fast.
    if not count:
        return False

    # What percentage of the time did the group meet at its most common venue?
    percentage = count.most_common(1)[0][1] / float(len(results))
    if percentage < threshold:
        return True
    return False

################################################################################
if __name__ == "__main__":
    zipcode = "10013"  # Perka office
    search_term = "React"

    groups = find_groups(zipcode, search_term)
    logger.info("Found %d %s Meetup groups near zip code %s." % (len(groups), search_term, zipcode))

    itinerant_groups = list()
    for group in groups:
        if is_itinerant(group['urlname']):
            itinerant_groups.append(group)
    logger.info("Found %d itinerant %s Meetup groups near zip code %s." % (len(itinerant_groups), search_term, str(zipcode)))

    for n, group in enumerate(itinerant_groups, start=1):
        logger.info(str(n) + ". %s, %s members, %s" % (str(group.get("name")), str(group.get("members")), str(group.get("link"))))
        if group.get("plain_text_description"):
            logger.info(group["plain_text_description"][:500])
