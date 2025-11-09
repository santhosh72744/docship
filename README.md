# Doc Ship

## Aim
Allows user to  send documents from USA to India.

## Workflow
1. Home → New shipment  
2. Select type of shipping: Document  
3. Select source country: USA  
   - After selecting USA → Show ZIP code field  
4. Select destination country: India  
   - After selecting India → Show PIN code field  
5. Choose courier (FedEx, UPS)
6. click on submit
7.  Show price, currency, and number of days required  
8.click on  Confirm

## Validations
- ZIP code must be 5 digits  
- PIN code must be 6 digits  
- Every field must be filled  
- If any field is empty → show “Enter all fields”

---

## Flow Diagram
 ```mermaid
flowchart TD

  A([Start]) --> B[New shipment]
  B --> C[ Select Type of shipping]
  C --> D[ Select Source country]
  D --> E[ Enter Zip code]
  E --> F[Select Destination country]
  F --> G[Enter Pin code]
  G --> H[Select courier service]
  H --> I[Submit]
  I --> J[Show details: price, currency, days required ]
  J --> K[Confirm]
  K --> L([End])

How to run locally :

# 1️⃣ Clone the repository
git clone https://github.com/santhosh72744/docship.git
cd docship

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start the development server

npm start      

 # 4️⃣ then open your browser:

CRA → http://localhost:3000



