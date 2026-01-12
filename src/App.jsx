import React, { useEffect, useState } from 'react'
import LoadError from './LoadError'

function escapeHtml(text) {
  if (text == null) return ''
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function FilterBar({ active, onChange }) {
  return (
    <div className="filter-bar">
      <button className={`filter-btn ${active === 'all' ? 'active' : ''}`} onClick={() => onChange('all')}>显示所有</button>
      <button className={`filter-btn ${active === 'wrong' ? 'active' : ''}`} onClick={() => onChange('wrong')}>只看做错</button>
      <button className={`filter-btn ${active === 'correct' ? 'active' : ''}`} onClick={() => onChange('correct')}>只看做对</button>
    </div>
  )
}

function Question({ q, idx, status, onCheck }) {
  const [selected, setSelected] = useState([])
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    setSelected([])
    setShowAnswer(false)
  }, [q])

  const toggleOption = (key, multi) => {
    if (multi) {
      setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
    } else {
      setSelected([key])
    }
  }

  const check = () => {
    let isOk = false
    if (q.isMulti) {
      const sel = [...selected].sort()
      const correct = Array.isArray(q.correct) ? q.correct.slice().sort() : (typeof q.correct === 'string' ? q.correct.split('') : [])
      isOk = JSON.stringify(sel) === JSON.stringify(correct)
      onCheck(idx + 1, isOk)
    } else {
      const sel = selected[0]
      if (!sel) {
        onCheck(idx + 1, false)
        setShowAnswer(true)
        return
      }
      isOk = sel === q.correct
      onCheck(idx + 1, isOk)
    }
    setShowAnswer(true)
  }

  return (
    <div className={`question ${status && status !== 'all' && status !== 'visible' && status !== 'matched' ? '' : ''}`} data-question={idx+1}>
      <div className="q-title">{q.isMulti ? <span className="multi">【多选】</span> : null}{idx+1}. <span dangerouslySetInnerHTML={{ __html: escapeHtml(q.title) }} /></div>
      {q.code ? <div className="code" dangerouslySetInnerHTML={{ __html: escapeHtml(q.code) }} /> : null}
      <div className="options">
        {q.options.map(opt => (
          <label key={opt.key}>
            <input
              type={q.isMulti ? 'checkbox' : 'radio'}
              name={`q${idx+1}`}
              value={opt.key}
              checked={selected.includes(opt.key)}
              onChange={() => toggleOption(opt.key, q.isMulti)}
            />
            <span dangerouslySetInnerHTML={{ __html: escapeHtml(`${opt.key}. ${opt.text}`) }} />
          </label>
        ))}
      </div>
      <button className="show-btn" onClick={check}>显示答案</button>

      <div className={`answer ${showAnswer ? 'show' : ''}`}>
        {showAnswer && (
          <div>
            {status === 'correct' ? (
              <div className="correct">正解！<br /><strong>正确：{Array.isArray(q.correct) ? q.correct.join(', ') : q.correct}</strong></div>
            ) : (
              <div className="wrong">不正解<br /><strong>正确：{Array.isArray(q.correct) ? q.correct.join(', ') : q.correct}</strong></div>
            )}
            <div className="explanation" dangerouslySetInnerHTML={{ __html: escapeHtml(q.explanation) }} />
          </div>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [questions, setQuestions] = useState([])
  const [statusMap, setStatusMap] = useState({})
  const [filter, setFilter] = useState('all')
  const [loadError, setLoadError] = useState(null)

  const loadQuestions = () => {
    setLoadError(null)
    fetch('base-java-questions.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}: 无法加载题目文件`)
        return r.json()
      })
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('题目数据格式错误或为空')
        }
        setQuestions(data)
      })
      .catch(err => {
        setLoadError(err.message)
        setQuestions([])
      })
  }

  useEffect(() => {
    loadQuestions()
  }, [])

  const handleCheck = (num, isOk) => {
    setStatusMap(m => ({ ...m, [num]: isOk ? 'correct' : 'wrong' }))
  }

  const visibleQuestions = questions.filter((q, i) => {
    const s = statusMap[i+1]
    if (filter === 'all') return true
    if (filter === 'wrong') return s === 'wrong'
    if (filter === 'correct') return s === 'correct'
    return true
  })

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', color: 'var(--primary)' }}>Java 面试题练习</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>点击「显示答案」查看正误与解析</p>

      {loadError ? (
        <LoadError error={loadError} onRetry={loadQuestions} />
      ) : (
        <>
          <FilterBar active={filter} onChange={(f) => setFilter(f)} />

          {questions.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>加载中...</div>
          ) : visibleQuestions.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666' }}>暂无题目或无符合条件的题目</div>
          ) : (
            visibleQuestions.map((q, idx) => (
              <Question key={idx} q={q} idx={questions.indexOf(q)} status={statusMap[questions.indexOf(q)+1]} onCheck={handleCheck} />
            ))
          )}
        </>
      )}
    </div>
  )
}
