# open-guidebook

## Motivation

Conventions of all types benefit from having some kind of mobile guidebook for displaying events.
There's a bunch of apps out there which offer efforltess creation of guidebooks ... at a (pricy) cost.
This project is an open-source implementation which aims to provide a free app.
To further aid deployment, it's also set up as a Docker container that you can simply plop inside a server, set it up for an event, and then destroy everything afterwards.

## Requirements

- Linux, Mac OS, WSL/Cygwin
- Python 3.x
- `npm`, and React.js 

Additional Deployment Requirements:
- Some kind of virtual private server (VPS) preferrably running Linux
- Some kind of database (e.g. PostgreSQL, optional)

## Installation Instructions

1. `git clone https://github.com/kir12/cjn-webapp.git && cd webapp`
2. `python -m venv env && source env/bin/activate`
3. `pip install -r requirements.txt`
4. `python manage.py migrate`

React/Docker -specific instructions to come soon

## Sources Used

- https://www.valentinog.com/blog/drf/
