import sys

def PrintHeader():
    print("{")
    print("  \"cmd\": \"get\",")
    print("  \"object\": \"\",")
    print("  \"modifier\": \"\",")
    print("  \"role\": \"default\",")
    print("  \"help\": \"get ???\",")
    print("  \"description\": \"get ???\",")
    print("  \"options\": [")

def PrintFooter():
    print("  ]")
    print("}")

if len(sys.argv) <= 1:
    print("ERROR: Supply filename as argument")
    sys.exit()

# read all lines in a sql file, convert to json array for isvbot .dropin use
# simple multi-statement handling: if ';' ends a line, will be removed and start a new block
with open(sys.argv[1]) as sql:
    PrintHeader()

    line = sql.readline()
    section = False  # json array section
    while line:
        if not section: # create a new json array section as necessary
            if not line.strip(): # but skip empty lines between sections
                line = sql.readline()
                continue
            print("    {")
            print("      \"option\": \"\",")
            print("      \"default\": true,")
            print("      \"description\": \"\",")
            print("      \"header\": \"\",")

            print("      \"SQL\" : [")
            section = True

        print("        \"{}\",".format(line.rstrip('; \r\n').replace("\"", "\\\"")))

        if line.strip().endswith(';'): # multi-statement handling for simplist case
            print("      ]")
            print("    }")
            section = False

        line = sql.readline()

    if section: # close last json section
        print("      ]")
        print("    }")

    PrintFooter()
