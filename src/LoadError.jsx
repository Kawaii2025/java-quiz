export default function LoadError({ error, onRetry }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '40px 20px',
      color: '#d32f2f',
      backgroundColor: '#ffebee',
      borderRadius: '8px',
      margin: '20px'
    }}>
      <h2>❌ 加载题目失败</h2>
      <p>{error || '无法从服务器加载题目数据。请检查网络连接或稍后重试。'}</p>
      <button
        onClick={onRetry}
        style={{
          marginTop: '15px',
          padding: '10px 20px',
          backgroundColor: '#d32f2f',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1em'
        }}
      >
        🔄 重新加载
      </button>
    </div>
  )
}
