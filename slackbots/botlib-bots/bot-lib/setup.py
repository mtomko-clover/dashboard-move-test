from distutils.core import setup

from setuptools import find_packages

setup(
    name='botlib',
    version='1.3.8',
    packages=find_packages(),
    requires=[
        'pandas',
        'numpy',
        'sshtunnel',
        'MySQLdb',
        'sqlalchemy',
        'rbac',
        'APScheduler',
        'dateparser'
    ],
    url='',
    license='',
    author='joel.mcintyre',
    author_email='joel.mcintyre@clover.com',
    description='',
)
