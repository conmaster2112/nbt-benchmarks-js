# nbt-benchmarks-js
- Requirements
  - Deno
  - PNPM

- Setup
```
pnpm install
pnpm run bench
```


```properties
clk: ~2.83 GHz
cpu: 12th Gen Intel(R) Core(TM) i7-12700H
runtime: deno 2.3.6 (x86_64-pc-windows-msvc)

benchmark                    avg (min … max) p75 / p99    (min … top 1%)
-------------------------------------------- -------------------------------
• File: file:///P:/Programming/nbt-benchmarks-js/data/noheader.level.dat
• Size: 2 kb
-------------------------------------------- -------------------------------
Bedrock APIs/carolina          73.89 µs/iter  72.10 µs ▅█
                      (69.40 µs … 400.40 µs) 117.20 µs ██
                     (  2.33 kb … 658.74 kb)  36.20 kb ██▃▄▂▂▂▂▁▁▁▁▁▁▁▁▁▁▁▁▁

prismarine-nbt ArraySizeCheck  77.51 µs/iter  74.40 µs █
                      (70.80 µs … 671.00 µs) 143.70 µs █▇
                     (424.00  b … 582.07 kb)  86.08 kb ██▄▃▂▂▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁

prismarine-nbt                 77.98 µs/iter  76.00 µs  █
                      (70.80 µs … 447.20 µs) 125.30 µs ▆█
                     ( 45.39 kb … 210.68 kb)  83.09 kb ██▅▃▃▂▂▂▁▁▁▁▁▂▁▁▁▁▁▁▁

@serenityjs/nbt               979.14 µs/iter 900.30 µs  ▅█
                       (688.00 µs … 3.12 ms)   2.77 ms  ██
                     (  8.06 kb … 710.52 kb)  86.48 kb ▇██▃▁▂▁▁▁▁▁▄▂▁▁▁▁▁▁▁▁

summary
  Bedrock APIs/carolina
   1.05x faster than prismarine-nbt ArraySizeCheck
   1.06x faster than prismarine-nbt
   13.25x faster than @serenityjs/nbt

• File: file:///P:/Programming/nbt-benchmarks-js/data/test_name.mcstructure
• Size: 11406 kb
-------------------------------------------- -------------------------------
Bedrock APIs/carolina          29.43 ms/iter  30.45 ms      █
                       (27.46 ms … 32.52 ms)  31.37 ms  ▅   █         ▅  ▅  
                     ( 22.48 mb …  22.48 mb)  22.48 mb ▇█▇▁▇█▁▁▇▁▁▇▇▁▇█▇▁█▁▇

prismarine-nbt ArraySizeCheck  88.08 ms/iter  91.27 ms  ██
                      (79.92 ms … 103.30 ms) 102.98 ms ▅██▅  ▅▅  ▅   ▅     ▅
                     ( 10.35 mb … 105.68 mb)  27.27 mb ████▁▁██▁▁█▁▁▁█▁▁▁▁▁█

prismarine-nbt                 91.43 ms/iter  92.61 ms █        █
                      (80.53 ms … 124.02 ms) 101.40 ms █  ▅▅  ▅▅█  ▅▅      ▅
                     ( 14.38 mb … 117.71 mb)  46.70 mb █▁▁██▁▁███▁▁██▁▁▁▁▁▁█

@serenityjs/nbt                  7.31 s/iter    7.62 s                    █ 
                           (4.31 s … 7.83 s)    7.80 s                    █
                     ( 32.11 kb … 217.80 mb)  62.03 mb ▅▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█▅█▅

summary
  Bedrock APIs/carolina
   2.99x faster than prismarine-nbt ArraySizeCheck
   3.11x faster than prismarine-nbt
   248.47x faster than @serenityjs/nbt
```