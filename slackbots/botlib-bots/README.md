# DevRel Tools - DART Team

This repo serves to host a variety of devrel specific tools for the DevRel Automation, Reporting, and Tools team, particularly the bot library the isvbot (ISV Engineering)

This starts as a copy from isvtools and isvbot. Consider isv references as devrel references that need updating from the initial fork.

### Setting up python and libraries on bulldog ###

Bulldog does not support python3, pip or virtualenv. To create a working environment you can install
pip as a local user install, and then use pip to install packages within the users home directory.

* Assumes python 2.7.* and a version of mysql are installed already

##### Install pip locally
python 2.7 is installed in opt/clover/pyre/. Default python is 2.6. Add the following entry in your .bashrc or 
.bash_profile to default to python 2.7.

```
export PATH=/opt/clover/pyre/bin:$PATH
```
##### Install pip in your user environment
```
$ wget https://bootstrap.pypa.io/get-pip.py
$ python get-pip.py --user
```
This will install the pip tools under ~/.local

##### Add pip to your path:

```
export PATH=${HOME}/.local/bin:${PATH}
```

#### Install the requirements locally:

```
pip install -r requirements.txt --user
```


### Install the bot-lib
The majority of functionality for all bots is encapsulated in a python module. Install the module into your local pip site

```
cd bot-lib
python setup.py clean install --user --prefix=
```

### Create bot instances

You will need to define a couple of environment variables to supply the Slack API Token, i.e.
Configuration of a bot instance is defined in a single yaml file under the cfg directory:

```
cfg/bot.yaml
```

#### Encrypted Config

The bot-lib currently supports using your gpg keypair to encrypt/decrypt the bot.yaml config file to better protect any sensitive data contained, i.e. username/passwords for db access, tokens, etc. An unencrypted config file is also supported, but using encryption is recommended.

The encrpytion is based on [SOPS: Secrets OPerationS](https://github.com/mozilla/sops)

#### Encryption/Decryption using SOPS

To manage the encryption and decryption of the bot.yaml file, install the sops package from brew:

```
brew install sops
```

You will also need a gpg key pair. GPG is also available in brew

```
brew install gnupg
```
You can then follow this guide to create your keypair. [GPG Key Generation](https://help.github.com/articles/generating-a-new-gpg-key)

To use this key, find the fingerprint for your desired key, and export it in the SOPS\_PGP_FP environment variable.

```
$gpg -k
pub   rsa4096 2018-01-20 [SC]
      17D8E8E68EE9BB9AE11E85E1BEEC709816CEB00A
uid           [ultimate] Bot Encrpytion (Used for encrypting BOT yaml files) <mike.brooking@clover.com>
sub   rsa4096 2018-01-20 [E]
```
The fingerprint is below the public key description, **_17D8E8E68EE9BB9AE11E85E1BEEC709816CEB00A_**

```
export SOPS_PGP_FP="17D8E8E68EE9BB9AE11E85E1BEEC709816CEB00A
```

To encrypt a plain text bot.yaml config file in the current directory, use the command:

```
sops -e -i /path/to/existing/bot.yaml
```

to decrypt the file in place for editing, use 

```
sops -d -i /path/to/existing/bot.yaml
```

## Current Bots
* See [DevRel Bot](slackbots\botlib-bots/devrelbot/DEVREL_DROPINS.md) - DevRel Bot

## Writing Dropins
See [Dropin Developers Guide](DROPIN_DEVGUIDE.md)

## Changelog
