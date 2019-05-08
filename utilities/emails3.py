# https://github.com/kristalinc/data-analytics-tools/blob/develop/monitoring/services/emails.py

import os
import smtplib

from getpass import getpass
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication


def send(toAddress, subject, body, fromAddress=None, attachmentText=None, attachmentName=None, cc=None, bcc=None):
    msg = MIMEMultipart("mixed")
    msg["Subject"] = subject
    msg["From"] = fromAddress

    if isinstance(toAddress, str):
        toAddress = [toAddress]
        msg["To"] = toAddress
    else:
        msg["To"] = ",".join(toAddress)

    if cc:
        if isinstance(cc, str):
            msg["Cc"] = cc
            toAddress += [cc]
        else:
            msg["Cc"] = ",".join(cc)
            toAddress += cc

    if bcc:
        if isinstance(bcc, str):
            toAddress += [bcc]
        else:
            toAddress += bcc

    textPart = MIMEText(body, "plain", "utf-8")
    msg.attach(textPart)

    if attachmentText is not None:
        attachment = MIMEText(attachmentText, "plain", "utf-8")
        attachment.add_header("Content-Disposition", "attachment", filename=(attachmentName or "attachment.txt"))
        msg.attach(attachment)

    # Send the message via local SMTP server.
    s = smtplib.SMTP("localhost")

    # To test using gmail SMTP, uncomment these lines and comment out the above line
    # input("WARNING: Sending an email to " + ",".join(toAddress) + ". Kill the process now if you didn't mean to do this.")
    # s = smtplib.SMTP("smtp.gmail.com", 587)
    # s.starttls()
    # s.ehlo
    # username = raw_input("Username: ")
    # s.login(username, getpass())

    # sendmail function takes 3 arguments: sender's address, recipient's address
    # and message to send - here it is sent as one string.
    s.sendmail(fromAddress, toAddress, msg.as_string())
    s.quit()


def sendemail(sender, recipients, subject, body, attachments=[]):
    msg = MIMEMultipart()
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = ", ".join(recipients)
    
    msg.preamble = 'Multipart massage.\n'

    text=MIMEText(body, 'html')
    msg.attach(text)

    for myfile in attachments:
        myname=os.path.basename(myfile)
        part = MIMEApplication(open(myfile,"rb").read())
        part.add_header('Content-Disposition', 'attachment', filename=myname)
        msg.attach(part)

    s = smtplib.SMTP('localhost')
    s.sendmail(sender, recipients, msg.as_string())
    s.quit()
