import getpass

print("creating secrets.yaml (ctrl-c to abort)")

jira_user = input("Jira user (LDAP): ")
jira_pass = getpass.getpass("Jira pass (LDAP): ")
db_user   = input("DB user (shards): ")
db_pass   = getpass.getpass("DB pass (shards): ")

with open("secrets.yaml", "w") as secretsfile:
  print(f"jira_user: {jira_user}", file=secretsfile)
  print(f"jira_password: {jira_pass}", file=secretsfile)
  print(f"db_user: {db_user}", file=secretsfile)
  print(f"db_password: {db_pass}", file=secretsfile)

print("successfull wrote secrets.yaml")