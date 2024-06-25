import re


def get_date_data(text: str) -> str:
    pattern = r"(\d{4})-(\d{1,2})-(\d{1,2})"
    match = re.search(pattern, text)
    return match.group()
