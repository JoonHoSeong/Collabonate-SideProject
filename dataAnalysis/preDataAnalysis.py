import glob

import pandas as pd
from tools.my_preprocessing import get_date_data


def data_preProcessing() -> pd.DataFrame:
    # Get All csv File in Data Folder
    file_list = glob.glob("Data/*.csv")

    # Get file Columns name
    data_colum = pd.read_csv(file_list[0]).columns

    # Load All Data
    news_data = pd.DataFrame()

    # Concat All Data
    for file in file_list:
        news_data = pd.concat([news_data, pd.read_csv(file)], axis=0)

    # Delete Null Data
    news_data.dropna(inplace=True)

    # Reset DataFrame Index
    news_data.reset_index(drop=True, inplace=True)

    # Set Date format as year-month-day
    for i in range(len(news_data)):
        news_data.loc[i, "date"] = get_date_data(news_data.loc[i, "date"])

    # Set Major, Sub Category Columns
    for i in range(len(news_data)):
        news_data.loc[i, "major_category"] = news_data.loc[i, "category"].split("_")[0]
        news_data.loc[i, "sub_category"] = news_data.loc[i, "category"].split("_")[1]
    # Delete Category Column
    news_data.drop(["category"], axis=1, inplace=True)

    return news_data


def main():
    data_preProcessing()


if __name__ == "__main__":
    main()
