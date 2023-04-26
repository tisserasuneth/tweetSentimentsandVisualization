import pandas as pd


list = pd.read_csv('uscities.csv')
budlight = pd.read_csv('budlight.csv',index_col=0)
coors = pd.read_csv('coors.csv',index_col=0)
yuengling = pd.read_csv('yuengling.csv',index_col=0)
count = 0

for i in range(0,50):
    budlight['latitude'][i] = list['lat'][count]
    budlight['longitude'][i] = list['lng'][count]
    count += 1

for i in range(0,50):
    coors['latitude'][i] = list['lat'][count]
    coors['longitude'][i] = list['lng'][count]
    count += 1

for i in range(0,50):
    yuengling['latitude'][i] = list['lat'][count]
    yuengling['longitude'][i] = list['lng'][count]
    count += 1

budlight.to_csv('budlight.csv')
coors.to_csv('coors.csv')
yuengling.to_csv('yuengling.csv')
