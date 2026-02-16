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

# 3. CHIẾN LƯỢC TRẢ SỚM (Thanh toán bổ sung)
### 3.1 Trả thêm hàng tháng:
- Thanh toán tháng k = PMT + Số tiền trả thêm hàng tháng
### 3.2 Thanh toán một lần tại tháng cụ thể:
- Thanh toán tháng k = PMT + Số tiền thanh toán thêm
### Ảnh hưởng:

- Khi thanh toán thêm, dư nợ giảm nhiều hơn → lãi tiếp theo giảm → khoản vay được hoàn trả sớm
- Ngày tất toán thay đổi (rút ngắn từ 240 tháng)

### Ví dụ từ trang:

Nếu trả thêm 100,000,000 VND vào tháng 12:

Thanh toán tháng 12 = 17,356,465 + 100,000,000 = 117,356,465
Dư nợ tháng 12 giảm tương ứng
Ngày tất toán thay đổi từ "Tháng 2 2046" (240 tháng) thành "Tháng 12 2043" (214 tháng)




# 4. CẤU HÌNH PHÍ PHẠT TRẢ SỚM
### 4.1 Phí phạt dựa trên % dư nợ:
- Phí phạt tháng k = Dư nợ tháng k × (% Phí trên dư nợ / 100)
- Phí phạt tối đa = Giá trị cố định đã cấu hình
- Phí thực tế = Min(Phí phạt tính toán, Phí phạt tối đa)
### 4.2 Giai đoạn áp dụng:

Số năm áp dụng: Phí phạt chỉ áp dụng trong N năm đầu
Sau giai đoạn: Không còn phí phạt nếu trả sớm

### Ví dụ cấu hình:
```
% Phí trên dư nợ: 1%
Số năm áp dụng: 1 (12 tháng)
Phí phạt tối đa: 0

Nếu trả sớm trong 12 tháng đầu với dư nợ 1,996,810,202:

Phí = 1,996,810,202 × 1% = 19,968,102 VND
```

# 5. LỊCH TRÌNH LÃI SUẤT THAY ĐỔI (Multi-Stage Interest Rate)
### 5.1 Cấu hình giai đoạn:
Trang cho phép cấu hình nhiều giai đoạn với lãi suất khác nhau:
### Ví dụ từ trang:
```
Lãi suất cuối kỳ: 8.5% (áp dụng sau khi hết các giai đoạn)
Giai đoạn 1: 6% lãi suất, 2 năm (24 tháng)
Giai đoạn 2: 10% lãi suất, 3 năm (36 tháng)
Giai đoạn 3 (mặc định): 8.5% lãi suất, 15 năm còn lại (180 tháng)
```

## 5.2 Công thức tính lãi theo giai đoạn:
### Lãi suất hàng tháng cho mỗi giai đoạn:
```
r_giai_doan = Lãi suất hàng năm / 100 / 12
Tiền lãi tháng k:
Lãi tháng k = Dư nợ tháng k-1 × r_giai_doan_hiện_tại
Gốc tháng k:
Gốc tháng k = Thanh toán tháng k - Lãi tháng k
Dư nợ tháng k:
Dư nợ tháng k = Dư nợ tháng k-1 - Gốc tháng k
```
## 5.3 Ví dụ tính toán chi tiết:
### Thông số:
```
Vay: 2,000,000,000 VND
Thời hạn: 20 năm (240 tháng)
Giai đoạn 1: 6%/năm, 24 tháng
Giai đoạn 2: 10%/năm, 36 tháng
Giai đoạn 3: 8.5%/năm, 180 tháng
```
### Lãi suất hàng tháng:
```
r₁ = 6% / 100 / 12 = 0.005 (0.5%)
r₂ = 10% / 100 / 12 = 0.008333 (0.8333%)
r₃ = 8.5% / 100 / 12 = 0.007083 (0.7083%)
```

## 5.4 Khoản thanh toán hàng tháng (PMT):
Với nhiều giai đoạn lãi suất khác nhau, khoản thanh toán thay đổi tại các ranh giới giai đoạn.
### Công thức tính PMT cho giai đoạn đầu:
```
PMT₁ = P₀ × [r₁(1+r₁)^n₁(1+r₂)^n₂(1+r₃)^n₃] / 
           [(1+r₁)^n₁(1+r₂)^n₂(1+r₃)^n₃ - 1]
```
### Trong đó:

- P₀ = Số tiền vay gốc
- r₁, r₂, r₃ = Lãi suất hàng tháng của các giai đoạn
- n₁, n₂, n₃ = Số tháng của các giai đoạn

### Với ví dụ trên:
```
PMT₁ = 2,000,000,000 × [0.005(1.005)^24(1.008333)^36(1.007083)^180] / 
                        [(1.005)^24(1.008333)^36(1.007083)^180 - 1]
     = **14,328,621 VND** (giai đoạn 1)
```
## 5.5 Khoản thanh toán thay đổi tại các giai đoạn:
### 1/ Tháng 1-24 (Giai đoạn 1, 6%):

Thanh toán = 14,328,621 VND/tháng
### Ví dụ tháng 1:
```
Dư nợ đầu: 2,000,000,000
Lãi = 2,000,000,000 × 0.005 = 10,000,000
Gốc = 14,328,621 - 10,000,000 = 4,328,621
Dư nợ cuối = 2,000,000,000 - 4,328,621 = 1,995,671,379
```


### 2/ Tháng 25-60 (Giai đoạn 2, 10%):

Thanh toán = 17,834,681 VND/tháng (tăng do lãi suất cao hơn)
### Ví dụ tháng 25:
```
Dư nợ đầu: 1,783,746,919 (dư nợ cuối tháng 24)
Lãi = 1,783,746,919 × 0.008333 = 14,864,558
Gốc = 17,834,681 - 14,864,558 = 2,970,123
Dư nợ cuối = 1,783,746,919 - 2,970,123 = 1,780,776,796
```


### 3/ Tháng 61-240 (Giai đoạn 3, 8.5%):

Thanh toán = sẽ tính lại dựa trên dư nợ còn lại tại tháng 60 và lãi suất 8.5%


5.6 So sánh: Lãi suất cố định vs. Lãi suất thay đổi
Yếu tốLãi suất cố định (8.5%)Lãi suất thay đổi (6%→10%→8.5%)Kỳ đầu tiên₫17,356,465₫14,328,621Giai đoạn 1 (24 tháng)₫17,356,465₫14,328,621Giai đoạn 2 (36 tháng)₫17,356,465₫17,834,681Tổng thanh toánCao hơn ở giai đoạn 1Thấp hơn ở giai đoạn 1, cao hơn ở giai đoạn 2

TÓM TẮT CÔNG THỨC ĐẦY ĐỦ (Phần 5 - Cập nhật)
Với lãi suất thay đổi theo giai đoạn, lãi tháng k được tính như sau:
Lãi tháng k = Dư nợ tháng k-1 × r_hiện_tại

Trong đó r_hiện_tại là:
  - r₁ nếu tháng k ≤ n₁ (giai đoạn 1)
  - r₂ nếu n₁ < tháng k ≤ n₁+n₂ (giai đoạn 2)
  - r₃ nếu n₁+n₂ < tháng k ≤ n₁+n₂+n₃ (giai đoạn 3)
  - ...