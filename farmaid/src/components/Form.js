import "./Form.css"

function Form({ title, fields, submitText, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = {}
    fields.forEach((field) => {
      formData[field.name] = e.target[field.name].value
    })
    onSubmit(formData)
  }

  return (
    <div className="form-container">
      <h2 className="form-title">{title}</h2>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            {field.type === "textarea" ? (
              <textarea id={field.name} name={field.name} placeholder={field.placeholder} required={field.required} />
            ) : field.type === "select" ? (
              <select id={field.name} name={field.name} required={field.required}>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
          </div>
        ))}
        <button type="submit" className="form-submit">
          {submitText}
        </button>
      </form>
    </div>
  )
}

export default Form
