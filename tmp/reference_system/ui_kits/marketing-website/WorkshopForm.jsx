// WorkshopForm — Request the workshop form with validation states.
function WorkshopForm() {
  const [touched, setTouched] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const nameErr = touched && !name;
  const emailErr = touched && !/^.+@.+\..+$/.test(email);

  return (
    <section className="sk-section">
      <div className="sk-container" style={{ maxWidth: 560 }}>
        <h2 className="sk-h2" style={{ marginBottom: 14 }}>Request the workshop</h2>
        <p className="sk-lead" style={{ marginBottom: 36 }}>
          Tell us who should be involved, how large the team is, and what you want
          the session to unlock.
        </p>

        <div style={{ marginBottom: 28 }}>
          <label className="sk-field-label">Name</label>
          <input className="sk-input" value={name} onChange={e => setName(e.target.value)} />
          {nameErr && <div className="sk-error">Please enter your name</div>}
        </div>

        <div style={{ marginBottom: 28 }}>
          <label className="sk-field-label">Email</label>
          <input className="sk-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          {emailErr && <div className="sk-error">Please enter a valid email</div>}
        </div>

        <div style={{ marginBottom: 28 }}>
          <label className="sk-field-label">Company or team</label>
          <input className="sk-input" placeholder="Your company, team, or function" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
          <div>
            <label className="sk-field-label">Team size</label>
            <select className="sk-select"><option>1–5</option><option>6–15</option><option>16+</option></select>
          </div>
          <div>
            <label className="sk-field-label">Desired timing</label>
            <select className="sk-select"><option>Not sure yet</option><option>This quarter</option><option>Next quarter</option></select>
          </div>
        </div>

        <button className="sk-btn sk-btn--primary" onClick={() => setTouched(true)}>
          Submit request
        </button>
      </div>
    </section>
  );
}
window.SKWorkshopForm = WorkshopForm;
