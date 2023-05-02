import pandas as pd
from transformers import pipeline
import sys
import json

labelsAndLoc = {'POSITIVE':0,
                'NEGATIVE':0
               }

def count(sentiment):
    if(sentiment in labelsAndLoc):
        labelsAndLoc[sentiment] += 1
    else:
        labelsAndLoc[sentiment] = 1

n = 50

def analyze(CSVName):
    print('hello')
    df = pd.read_csv(CSVName)
    tweets = df.head(n)['content'].values
    sentiment_values = []
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
        sentiment_values.append(result['label'])

    newDf = pd.read_csv(CSVName,nrows=n)   
    newDf.loc[:n-1, 'sentiment'] = sentiment_values
    newDf = newDf.loc[newDf['sentiment']=='NEGATIVE']
    labelsAndLoc['latitude'] = (newDf['latitude'].values).tolist()
    labelsAndLoc['longitude'] = (newDf['longitude'].values).tolist()
    jsonFile = json.dumps(labelsAndLoc)
    print(jsonFile)

def main():
    analyze(sys.argv[1])

if __name__ == "__main__": 
    main()

