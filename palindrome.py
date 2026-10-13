
def check_palindrome(text):
    # Convert to lowercase and ignore spaces/symbols
    cleaned = "".join(
        ch.lower() for ch in text if ch.isalnum()
    )

    if not cleaned:
        return False, []

    stack = []

    # Push each character onto the stack
    for ch in cleaned:
        stack.append(ch)

    # Pop characters to create reverse string
    reversed_text = ""

    while stack:
        reversed_text += stack.pop()

    return cleaned == reversed_text, list(reversed(cleaned))


def main():
    print("=== Palindrome Checker Using Stack ===")

    text = input("Enter a word, number or sentence: ")

    is_palindrome, _ = check_palindrome(text)

    if is_palindrome:
        print("Result: It is a palindrome!")
    else:
        print("Result: It is not a palindrome.")

    print("Original input:", text)


if __name__ == "__main__":
    main()
