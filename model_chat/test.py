from better_profanity import profanity

profanity.load_censor_words_from_file('profanity_vocabulary.txt')


def check_profanity_vocab(message):
    return not profanity.contains_profanity(message)


print(check_profanity_vocab('tức'))
