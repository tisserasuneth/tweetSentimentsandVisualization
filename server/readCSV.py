import pandas as pd
import sys

def read(CSVName):
    pd.set_option('display.max_rows', None)
    df = pd.read_csv(CSVName, index_col=None, names=None )
    pd.set_option('display.max_colwidth', None)
    for tweet in df['content']:
        print(tweet)

def main():
    read(sys.argv[1])

if __name__ == "__main__":
    main()

