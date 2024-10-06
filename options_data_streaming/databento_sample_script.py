import databento as db

client = db.Historical("db-WXgynHrcsFCjYm5g4qEpcnUQ3uMmF")

data = client.timeseries.get_range(
    dataset="GLBX.MDP3",
    symbols=["ES.OPT"],
    schema="mbp-1",
    start="2024-06-06T00:00:00",
    end="2024-06-07T00:00:00",
    limit=1,
    stype_in="parent",
)
df = data.to_df()
print(df.iloc[0].to_json(indent=4))