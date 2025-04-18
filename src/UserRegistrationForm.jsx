import React, { useState } from 'react';
import * as yup from 'yup';
import { IMaskInput } from 'react-imask';
import './UserRegistrationForm.css';

const UserRegistrationForm = () => {
  // Schema de validação
  const schema = yup.object().shape({
    nome: yup.string().required('Nome é obrigatório'),
    email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
    telefone: yup.string()
      .required('Telefone é obrigatório')
      .test('telefone', 'Telefone inválido', (value) => {
        // Se estiver vazio, o required já pegou
        if (!value || value.trim() === '') return true;

        // Se tiver valor, valida o formato
        return /^\(\d{2}\) \d{4,5}-\d{4}$/.test(value);
      }),
    senha: yup.string()
      .min(8, 'Senha deve ter no mínimo 8 caracteres')
      .required('Senha é obrigatória'),
    confirmarSenha: yup.string()
      .oneOf([yup.ref('senha'), null], 'Senhas não coincidem')
      .required('Confirmação de senha é obrigatória')
  });

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Manipulador de mudanças
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Limpa o erro específico quando o usuário digita
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Manipulador de submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clássica chamada de api
    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      setIsSubmitted(true);

    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach(error => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      senha: '',
      confirmarSenha: ''
    });
    setIsSubmitted(false);
  };

  return (
    <div className="container">
      {isSubmitted ? (
        <div className="success-message">
          <h2>Cadastro realizado com sucesso!</h2>
          <p>Obrigado por se cadastrar.</p>
          <button onClick={resetForm}>Voltar</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Cadastro de Usuário</h2>

          <div className="form-group">
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={errors.nome ? 'error' : ''}
            />
            {errors.nome && <span className="error-message">{errors.nome}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="telefone">Telefone:</label>
            <IMaskInput
              mask="(00) 00000-0000"
              placeholder="(00) 00000-0000"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
            />
            {errors.telefone && <span className="error-message">{errors.telefone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha:</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className={errors.senha ? 'error' : ''}
            />
            {errors.senha && <span className="error-message">{errors.senha}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmarSenha">Confirmar Senha:</label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              className={errors.confirmarSenha ? 'error' : ''}
            />
            {errors.confirmarSenha && <span className="error-message">{errors.confirmarSenha}</span>}
          </div>

          <button type="submit">Cadastrar</button>
        </form>
      )}
    </div>
  );
};

export default UserRegistrationForm;