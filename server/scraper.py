import pandas as pd
import snscrape.modules.twitter as sntwitter
import sys

tweets = []

def scrape(keywords,start,end):
    scraper = sntwitter.TwitterSearchScraper(keywords)
    for tweet in scraper.get_items():
        data = [tweet.rawContent, tweet.date, tweet.user.username]
        tweets.append(data)
        if len(tweets) > 100:
            break

    df = pd.DataFrame(tweets, columns=['content','date','username'])
    df.to_csv('tweets1.csv',index=False)
    print(df)
    return df

#https://medium.com/swlh/how-to-scrape-tweets-by-location-in-python-using-snscrape-8c870fa6ec25

def main():
    scrape(sys.argv[1],sys.argv[2],sys.argv[3])

if __name__ == '__main__': 
    main()