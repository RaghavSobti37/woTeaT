# Self-Learning Food Network Architecture Blueprint

To take the Next.js and PostgreSQL architecture from a basic prototype to a fully functioning, end-to-end self-learning platform, we integrate specialized vector capabilities, connect to a live food network, and automate order execution.

Here is the step-by-step blueprint and toolstack to achieve this architecture.

### Step 1: The Self-Learning Engine (PostgreSQL + pgvector)

To make the model uniquely catered to an individual, you must store their Taste Profile as a mathematical vector and update it continuously. Since you are already using PostgreSQL, you do not need a separate vector database.

* **The Tool:** Install the **`pgvector`** extension for PostgreSQL. This allows you to store arrays of floating-point numbers directly in your database and query them for similarity. Use **Drizzle ORM** (or Prisma) in your Next.js backend, as both have native support for `pgvector`.
* **The Workflow:**
1. Create a column for the user's Taste Vector using the `VECTOR(5)` data type to represent the 5 dimensions (Spice, Cream, Fry, Tang, Carb).
2. When a user rates a meal, calculate the vector drift. For instance, if they say a meal was "Too Spicy," mathematically decrease the "Spice" coordinate in their vector and run an `UPDATE` query on their row.
3. This continuous feedback loop acts as a "Contextual Bandit," actively learning and adjusting to changing human intent over time.

### Step 2: Sourcing Real Restaurant Data via ONDC

Historically, developers had to rely on fragile web scraping (like Puppeteer or Selenium) to get data from Swiggy or Zomato, which frequently results in IP bans and broken workflows. The modern, scalable best practice in India is to integrate directly with the **Open Network for Digital Commerce (ONDC)**.

* **The Tool:** The **ONDC Beckn Protocol**. You will register your application as a "Buyer App" (BAP) on the ONDC network. You can use the `ondc-node` SDK to handle the API integrations in your backend.
* **The Workflow:**
1. Register on the ONDC Mock/Sandbox environment to get test API credentials.
2. Capture the user's real-time GPS coordinates (using the Google Maps SDK or browser Geolocation API).
3. Trigger an ONDC `/search` API call containing the GPS coordinates. The network will respond via the `/on_search` webhook, delivering a massive JSON payload containing actual local restaurant catalogs, real-time menus, and pricing.

### Step 3: Algorithmic Curation and Budgeting

Once you receive the restaurant catalogs from ONDC, your Next.js backend must select the perfect dish.

* **The Workflow:**
1. **Filter by Budget:** Run a strict server-side filter to drop any menu items from the ONDC payload that exceed the user's `daily_max_budget`.
2. **Vectorize the Menu:** Map the nutritional/flavor metadata of the remaining dishes into 5-dimensional item vectors.
3. **The "Exploitation" Match (Standard Order):** Use Drizzle ORM to query your PostgreSQL database, utilizing the `cosineDistance` function to find the dish vector that most closely aligns with the user's current Taste Vector.
4. **The "Exploration" Match (Random/Go Wild):** If the user chooses the "Go Wild" option, inject an Epsilon-Greedy approach. Your backend should intentionally invert 1 or 2 axes of their taste vector (e.g., swapping low-spice for high-spice) and query Postgres for a dish matching this *new* serendipitous coordinate, ensuring the recommendation is novel but still mathematically calculated.

### Step 4: Placing the Automated Order

Once the algorithm has locked in the dish, the platform must execute the transaction seamlessly without user intervention.

* **The Workflow:**
Using the `ondc-node` integration, orchestrate the following automated API flow in the background:
1. **`/select`**: Add the algorithmically chosen item to the digital cart. The network responds with `/on_select` confirming item availability and final pricing.
2. **`/init`**: Send the user's delivery address and billing details. The seller network responds with `/on_init`, providing a payment link or confirming the transaction terms.
3. **`/confirm`**: Since your app uses a pre-loaded UPI wallet, your backend deducts the exact amount internally and fires the `/confirm` API call to the seller with the transaction ID.
4. **`/on_status` & `/track`**: The seller accepts the order. You can now use the `/track` API to update the user's Next.js frontend with live delivery status (e.g., Packed, Out-for-delivery).
