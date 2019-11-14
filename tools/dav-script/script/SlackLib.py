
def update_slack(message , slack_host, slack_channels):
    #todo: Slack update doesn't exist. Need a microservice to provide a bridge to slack for both generic tool reporting
    #      and specific channel reporting. That is, all tools report to 'tools', and some tools reoport to specific channels like #devrel "dav complete"
    # (f"DAV script: {devs} new or updated developers in region {args.region} since {args.date}", slack_host, slack_channels)
    print(f'skipping posting to slack bridge microservice: {slack_host} and channels {slack_channels}')
    print('   ', message)
    print('')
    print("    mostly because it doesn't exist. As soon as that's fixed, we can report activity there. And to the metrics activity db.")
