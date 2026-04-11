import pandas as pd
import numpy as np
from faker import Faker

fake = Faker('en_IN')  # Indian locale

def generate_rows(schema: dict, n_rows: int) -> pd.DataFrame:
    df = pd.DataFrame()

    for col in schema.get("columns", []):
        name = col["name"]
        col_type = col["type"]

        if col_type == "name":
            df[name] = [fake.name() for _ in range(n_rows)]

        elif col_type == "email":
            df[name] = [fake.email() for _ in range(n_rows)]

        elif col_type == "phone":
            df[name] = [fake.phone_number() for _ in range(n_rows)]

        elif col_type == "date":
            df[name] = [fake.date_between(
                start_date='-5y', end_date='today'
            ).isoformat() for _ in range(n_rows)]

        elif col_type in ["int", "float"]:
            values = np.random.normal(
                col.get("mean", 50),
                col.get("std", 10),
                n_rows
            ).clip(col.get("min", 0), col.get("max", 100))
            df[name] = values.astype(int) if col_type == "int" else values.round(2)

        elif col_type == "categorical":
            vals = col.get("values", ["A", "B"])
            weights = col.get("weights", None)
            if weights and len(weights) != len(vals):
                weights = None
            df[name] = np.random.choice(vals, n_rows, p=weights)

        elif col_type == "bool":
            df[name] = np.random.choice([True, False], n_rows)

    return df