
def check_palindrome(text):
    cleaned = "".join(
        ch.lower() for ch in text if ch.isalnum()
    )

    if not cleaned:
        return False, []

    stack = []

    for ch in cleaned:
        stack.append(ch)

    reversed_text = ""

    while stack:
        reversed_text += stack.pop()

    return cleaned == reversed_text, reversed_text


if __name__ == "__main__":
    text = input("Enter a word or sentence: ")
    result, reversed_text = check_palindrome(text)

    print("Reversed text:", reversed_text)
    print("Result:", "Palindrome" if result else "Not a palindrome")
