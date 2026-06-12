import Navbar from "./navbar";

function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />
      <div className="container">
        {children}
      </div>
    </div>
  );
}

export default Layout;