# 1. CÔNG THỨC TÍNH THANH TOÁN HÀNG THÁNG (Lãi suất cố định)
### Công thức cơ bản:
```
PMT = P × [r(1+r)^n] / [(1+r)^n - 1]
```
### Thành phần:

- P = Số tiền vay gốc (sau trừ trả trước)
- r = Lãi suất hàng tháng = Lãi suất hàng năm / 100 / 12
- n = Tổng số tháng = Thời hạn (năm) × 12
- PMT = Khoản thanh toán hàng tháng

### * Ví dụ: Vay 2 tỷ, 20 năm, lãi 8.5%
```
r = 8.5% / 100 / 12 = 0.00708333
n = 20 × 12 = 240
PMT = 2,000,000,000 × [0.00708333(1.00708333)^240] / [(1.00708333)^240 - 1] = 17,356,465 VND/tháng
```

# 2. CÔNG THỨC TÍNH TIỀN LÃI TỪNG THÁNG
### Công thức:
```
Lãi tháng k = Dư nợ tháng k-1 × r
Gốc tháng k = Thanh toán hàng tháng - Lãi tháng k
Dư nợ tháng k = Dư nợ tháng k-1 - Gốc tháng k
```

### * Ví dụ tháng 1 và 2:
```
Tháng 1:

Dư nợ ban đầu: 2,000,000,000
Lãi = 2,000,000,000 × 0.00708333 = 14,166,667
Gốc = 17,356,465 - 14,166,667 = 3,189,798
Dư nợ còn: 2,000,000,000 - 3,189,798 = 1,996,810,202

Tháng 2:

Lãi = 1,996,810,202 × 0.00708333 = 14,144,072
Gốc = 17,356,465 - 14,144,072 = 3,212,393
Dư nợ còn: 1,996,810,202 - 3,212,393 = 1,993,597,810
```

# 2. LỊCH TRÌNH LÃI SUẤT THAY ĐỔI 
### Ví dụ:
```
Vay: 2 tỉ
Lãi suất cuối kỳ: 8.5% (áp dụng sau khi hết các giai đoạn)
Giai đoạn 1: 6% lãi suất, 2 năm (24 tháng)
Giai đoạn 2: 10% lãi suất, 3 năm (36 tháng)
Giai đoạn 3 (mặc định): 8.5% lãi suất, 15 năm còn lại (180 tháng)
```

### Công thức
```
PMT₁ = P₀ × [r₁(1+r₁)^n₁(1+r₂)^n₂(1+r₃)^n₃] / 
           [(1+r₁)^n₁(1+r₂)^n₂(1+r₃)^n₃ - 1]
```
### Trong đó:

- P₀ = Số tiền vay gốc
- r₁, r₂, r₃ = Lãi suất hàng tháng của các giai đoạn
- n₁, n₂, n₃ = Số tháng của các giai đoạn

```
(1+r1​)24(1+r2​)36(1+r3​)180≈5.413

PMT₁ = 2,000,000,000 × [0.005(5.413)] / [5.413 - 1] = 12,270,000 VND/tháng

PMT₂ = 2,000,000,000 × [0.008333(5.413)] / [5.413 - 1] = 20,440,000 VND/tháng

PMT₃ = 2,000,000,000 × [0.007083(5.413)] / [5.413 - 1] = 17,370,000 VND/tháng

```