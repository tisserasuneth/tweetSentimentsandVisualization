import pandas as pd
from transformers import pipeline




labels = {}

def count(sentiment):
    if(sentiment in labels):
        labels[sentiment] += 1
    else:
        labels[sentiment] = 1
         
def analyze():
    df = pd.read_csv('tweets1.csv')
    tweets = df.head(20)['content'].values

    for tweet in tweets:
        tweet_words = []
        for word in tweet.split(' '):
            if word.startswith('@') and len(word) > 1:
                word = '@user'
            elif word.startswith('http'):
                word = "http"
            tweet_words.append(word)

        tweet_proc = " ".join(tweet_words)

        model_name = "distilbert-base-uncased-finetuned-sst-2-english"
        revision = "af0f99b"

        sentiment = pipeline("sentiment-analysis", model=model_name, revision=revision)
        result = sentiment(tweet_proc)[0]
        count(result['label'])
    print(labels)

def main():
    analyze()

if __name__ == "__main__": 
    main()



# for ele in analyzed:
#     negative+=ele[0]
#     neutral+=ele[1]
#     positive+=ele[2]

# avg_negative = negative/len(analyzed)
# avg_neutral = neutral/len(analyzed)
# avg_positive = positive/len(analyzed)

# print(avg_negative,avg_neutral,avg_positive)

# data = {'Value': [avg_negative*100, avg_neutral*100, avg_positive*100],
#         'Sentiment': ['Negative', 'Neutral', 'Positive']}
# df = pd.DataFrame(data)
