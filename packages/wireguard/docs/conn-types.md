WireGuard supports several types of connection setups based on the network topology and use case. These connection types define how devices (peers) communicate with each other using WireGuard. Below are the main WireGuard connection types:

---

### 1. **Point-to-Point (Peer-to-Peer)**
- **Description**: Direct communication between two devices.
- **Use Case**: Connecting two endpoints, such as a server and a client or two servers in a secure manner.
- **Example**: Connecting a remote laptop to a home server.

---

### 2. **Client-to-Server**
- **Description**: A client device connects to a centralized server acting as a hub for multiple clients.
- **Use Case**:
  - Remote access to a private network.
  - Centralized management of clients.
- **Example**: A mobile device connecting to a WireGuard server to access resources on a home or office network.

---

### 3. **Site-to-Site**
- **Description**: Two or more networks are securely connected through WireGuard endpoints at each site.
- **Use Case**:
  - Linking office branches.
  - Securely extending local area networks (LANs) over the internet.
- **Example**: Connecting the network at a main office to a remote office for seamless communication.

---

### 4. **Mesh Networking**
- **Description**: Every device acts as both a client and server, forming a decentralized network where all devices can communicate with each other.
- **Use Case**:
  - Distributed networks.
  - Peer-to-peer systems.
- **Example**: A group of IoT devices in a local network that need to communicate securely.

---

### 5. **Road Warrior**
- **Description**: A single device connects dynamically to various networks or endpoints while on the move.
- **Use Case**:
  - Mobile workers accessing corporate networks.
  - Secure internet browsing.
- **Example**: A traveling employee using WireGuard to connect to their company's private network.

---

### 6. **Hub-and-Spoke**
- **Description**: A centralized server connects to multiple clients (spokes), and clients communicate indirectly via the hub.
- **Use Case**:
  - Centralized data exchange and coordination.
  - Ensuring clients cannot directly communicate with each other for security or policy reasons.
- **Example**: A headquarters server providing access to several remote offices without allowing inter-office communication.

---

### 7. **Split Tunnel**
- **Description**: Only specific traffic is routed through the WireGuard tunnel, while other traffic uses the local internet connection.
- **Use Case**:
  - Minimizing latency and bandwidth usage.
  - Ensuring critical or sensitive traffic is encrypted while other traffic goes directly to the internet.
- **Example**: A remote worker accessing a company intranet while using their home internet for non-work activities.

---

Each of these types can be configured depending on the WireGuard setup and the requirements of the network or user.