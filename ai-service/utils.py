import re

def extract_text_features(text: str) -> list:
    """
    Extracts structural and linguistic flags from raw review text
    to assist the Gradient Boosting classifier in detecting fake copy.
    """
    length = len(text)
    
    # FIX: Calculate the raw word count split first safely
    words = text.split()
    word_count = len(words) if len(words) > 0 else 1
    
    # Track exclamation marks and excessive caps lock usage
    exclamation_count = text.count('!')
    caps_ratio = sum(1 for c in text if c.isupper()) / (length + 1)
    
    # Catch highly repetitive promotional generic phrase structures
    generic_phrases = len(re.findall(r'(amazing product|best ever|buy this now|waste of money|highly recommend)', text.lower()))
    
    return [length, word_count, exclamation_count, caps_ratio, generic_phrases]