class Card(object):
    def __init__(self, pan, cvv=None, expMonth=None, expYear=None, zip_code=None):
        if type(pan) != str:
            pan = str(pan)
        self.pan = pan
        self.first6 = pan[0:6]
        self.last4 = pan[-4:]
        self.cvv = cvv
        self.expMonth = expMonth
        self.expYear = expYear
        self.zip_code = zip_code

    def __repr__(self):
        return "{} {} {} {}".format(self.pan[:4], self.pan[4:8], self.pan[8:12], self.pan[12:])


class TestCard(Card):
    def __init__(self, pan, cvv=123, expMonth=12, expYear=2021, zip_code=94085, results=None, docs=True):
        super(TestCard, self).__init__(pan, cvv, expMonth, expYear, zip_code)
        
        # Validate or create results dict.
        results_keys = ["devpay", "manual"]
        if not results:
            results = { k: "APPROVED" for k in results_keys }
        if type(results) != dict:
            raise TypeError("'results' must be a dict")
        for k in results_keys:
            if k not in results:
                raise KeyError("results dict must include: " + ", ".join(results_keys))
        
        # Validate docs list.
        if docs and type(docs) != bool:
                raise TypeError("'docs' must be a bool")
        
        self.results = results
        self.docs = docs

    def __repr__(self):
        rep = super(TestCard, self).__repr__()
        return rep + ', %s' % self.results


TEST_CARDS = [
    TestCard(pan=6011905000000004, results={"devpay": "APPROVED",
                                            "manual": "DECLINED"},
                                            docs=False),
    TestCard(pan=4761739001010010, results={"devpay": "APPROVED",
                                            "manual": "DECLINED"},
                                            docs=False),
    TestCard(pan=5128570161312630, results={"devpay": "DECLINED",
                                            "manual": "DECLINED"},
                                            docs=False),
    TestCard(pan=4111111111111111, results={"devpay": "APPROVED",
                                            "manual": "APPROVED"},
                                            docs=False),
    TestCard(pan=4005562231212149, results={"devpay": "APPROVED",
                                            "manual": "APPROVED"},
                                            docs=False),
    TestCard(pan=4005571702222222, results={"devpay": "DECLINED",
                                            "manual": "DECLINED"}),
    TestCard(pan=4005578003333335, results={"devpay": "DECLINED",
                                            "manual": "PARTIAL_AUTH"}),
    TestCard(pan=6011361000006668, results={"devpay": "APPROVED",
                                            "manual": "APPROVED"})
]
LAST4_TEST_CARDS = { c.last4: c for c in TEST_CARDS }
DOCUMENTED_TEST_CARDS = [ c for c in TEST_CARDS if c.docs ]

################################################################################
if __name__ == "__main__":
    print(DOCUMENTED_TEST_CARDS)
