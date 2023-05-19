install:
	pip install -r requirements.txt

format:
	black *.py */*.py */*/*.py */*/*/*.py

lint:
	pylint --disable=R,C,E1120 *.py */*.py */*/*.py */*/*/*.py

all: install lint test