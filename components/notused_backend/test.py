from typing import Annotated

def double(x: Annotated[int, (0,100)]) -> int:
    return x * 2

result = double(102)
print(result)