## Meetup Finder
Python 2.7.15 script designed to find itinerant Meetup groups that we can build relationships with and potentially host at our offices.

### What makes a Meetup group itinerant?
A Meetup group is judged to be itinerant (and therefore open to being hosted by Clover) if, among its events held in the past three months and planned for the next three months, it has used its most common venue less than two-thirds of the time.

### A note about rate limiting
At the time of publishing, the Meetup API allows 30 requests to be made every 10 seconds. These limits are naively adhered to using `@limits` and `@sleep_and_retry` from [ratelimit](https://pypi.org/project/ratelimit/). A more robust approach would incorporate the response headers:

* **X-RateLimit-Limit** The maximum number of requests that can be made in a window of time.
* **X-RateLimit-Remaining** The remaining number of requests allowed in the current rate limit window.
* **X-RateLimit-Reset** The number of seconds until the current rate limit window resets.

### How to Use Meetup Finder

#### First Time Setup

1. In Terminal, navigate to `devrel-tools/meetup_finder/`.
2. Create a [virtual environment](https://docs.python-guide.org/dev/virtualenvs/) with Python 2.7.15 or compatible version.
3. Activate the virtual environment.
4. `pip install -r requirements.txt`
5. Copy your [Meetup API key](https://secure.meetup.com/meetup_api/key/).
6. `echo 'export MEETUP_API_KEY="your API key"' > secrets.sh`

#### Using meetup_finder.py

1. In Terminal, navigate to `devrel-tools/meetup_finder/` and activate the virtual environment.
3. `source secrets.sh`
4. Open `meetup_finder.py` and scroll down to the block `if __name__ == "__main__"`. Change `zipcode` and `search_term` to your desired values. Save your changes.
5. `python meetup_finder.py`
6. Results are printed to the console and logged to `{your_home_dir}/logs/meetup_finder.log`.
