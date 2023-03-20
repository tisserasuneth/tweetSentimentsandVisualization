import pandas as pd
import snscrape.modules.twitter as sntwitter

scraper = sntwitter.TwitterSearchScraper('bud light')
tweets = []

for tweet in scraper.get_items():
    data = [tweet.rawContent, tweet.date, tweet.user.username, tweet.likeCount, tweet.retweetCount]
    tweets.append(data)
    if len(tweets) > 1000:
        break

df = pd.DataFrame(tweets, columns=['content','date','username','likes','retweets'])
df.to_csv('tweets.csv',index=False)