import { useState } from 'react';
import '../styles/aitests.css';

const TEST_SERVER = import.meta.env.VITE_TEST_SERVER || 'http://localhost:3100';

function AiTests() {
  const [query, setQuery] = useState('');
  const [fresh, setFresh] = useState(false);
  const [matched, setMatched] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [message, setMessage] = useState(null);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [resolving, setResolving] = useState(false);

  const handleResolve = async () => {
    if (!query.trim()) return;
    setResolving(true);
    setMessage(null);
    setMatched(null);
    setSuggestions([]);
    try {
      const res = await fetch(`${TEST_SERVER}/api/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Le service a répondu avec une erreur (${res.status})`);
      }

      const data = await res.json();
      if (data.matched) {
        setMatched(data.matched);
        setMessage(null);
      } else {
        setMatched(null);
        setSuggestions(data.suggestions || []);
        setMessage(
          <p className="error-message">
            Phrase non reconnue. Essayez une des suggestions ci-dessous, ou reformulez.
          </p>
        );
      }
    } catch (err) {
      console.error('AiTests resolve error:', err);
      setMatched(null);
      setSuggestions([]);
      setMessage(
        <p className="error-message">
          Le service de tests IA est indisponible sur {TEST_SERVER}. Vérifiez qu’il est démarré ou configurez VITE_TEST_SERVER.
          {err?.message ? ` Détail : ${err.message}` : ''}
        </p>
      );
    } finally {
      setResolving(false);
    }
  };

  const handleRun = async () => {
    const target = query.trim();
    if (!target || running) return;
    setRunning(true);
    setOutput('');
    setMessage(null);

    try {
      const res = await fetch(`${TEST_SERVER}/api/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: target, fresh }),
      });
      if (!res.ok) {
        const txt = await res.text();
        setMessage(
          <p className="error-message">
            Le service de tests IA est inaccessible sur {TEST_SERVER}. Vérifiez qu’il est démarré ou configurez VITE_TEST_SERVER.
            {txt ? ` Détail : ${txt}` : ''}
          </p>
        );
        setRunning(false);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setOutput(text);
      }
      setRunning(false);
    } catch (err) {
      console.error('AiTests run error:', err);
      setMessage(
        <p className="error-message">
          Le service de tests IA est indisponible sur {TEST_SERVER}. Vérifiez qu’il est démarré ou configurez VITE_TEST_SERVER.
          {err?.message ? ` Détail : ${err.message}` : ''}
        </p>
      );
      setRunning(false);
    }
  };

  const applySuggestion = (phrase) => {
    setQuery(phrase);
  };

  return (
    <div className="aitests-container">
      <h2>Tests IA — Runner en ligne</h2>

      <div className="aitests-panel">
        <h3>Décrivez le test à lancer</h3>
        <div className="aitests-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleResolve()}
            placeholder="Ex : créer unn device, oubli du mot de passe..."
          />
          <button className="aitests-btn resolve" onClick={handleResolve} disabled={resolving || running}>
            {resolving ? 'Analyse...' : 'Interpréter'}
          </button>
        </div>
        {!matched && message}

        {matched && (
          <div className="aitests-matched">
            <strong>Scénario reconnu :</strong> {matched.name} ({matched.steps} étapes)
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="aitests-suggestions">
            <div className="aitests-suggestions-label">
              <strong>Vouliez-vous dire ?</strong> (cliquez pour copier dans la saisie) :
            </div>
            <div className="aitests-chips">
              {suggestions.map((s) => (
                <button key={s.name} className="aitests-chip" onClick={() => applySuggestion(s.phrase)}>
                  {s.phrase}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="aitests-row">
          <button className="aitests-btn run" onClick={handleRun} disabled={running || !query.trim()}>
            {running ? 'Test en cours...' : '▶ Lancer le test'}
          </button>
        </div>
      </div>

      {output && (
        <div className="aitests-console">
          <div className="aitests-console-header">
            <span>Console — {running ? 'en cours' : 'terminé'}</span>
          </div>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
}

export default AiTests;