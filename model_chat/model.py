from better_profanity import profanity

profanity.load_censor_words_from_file('profanity_vocabulary.txt')

# Kiem tra trong vocab
# Neu co trong vocab thi khong cho gui
# Neu khong co thi dung mo hinh du doan
# Neu ok thi cho gui


def check_profanity_vocab(message):
    return not profanity.contains_profanity(message)
