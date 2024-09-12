import Header from './components/Header'; 

export default function HomePage() {
  return (
    <div>
      <Header />
      
      <main style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Welcome to the DApp</h1>
        <p>This is the main content of the page.</p>
      </main>
    </div>
  );
}
