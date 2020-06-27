import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

import * as api from '../../api/apiService';

Modal.setAppElement('#root');

export default function ModalGrade({ onSave, onClose, selectedGrade }) {
  const { id, student, subject, type, value } = selectedGrade;

  const [gradeValue, setGradeValue] = useState(value);
  const [gradeValidation, setGradeValidation] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getValidation = async () => {
      const validation = await api.getValidationFromGradeType(type);
      setGradeValidation(validation);
    };

    getValidation();
  }, [selectedGrade.type]);

  useEffect(() => {
    const { minValue, maxValue } = gradeValidation;

    if (gradeValue < minValue || gradeValue > maxValue) {
      setErrorMessage(
        `O valor da nota deve ser entre ${minValue} e ${maxValue}`
      );
      return;
    }

    setErrorMessage('');
  }, [gradeValue, gradeValidation]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose(null);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formData = {
      id,
      newValue: gradeValue,
    };

    onSave(formData);
  };

  const handleModalClose = () => {
    onClose(null);
  };

  const handleGradeChange = (e) => {
    setGradeValue(+e.target.value);
  };

  return (
    <div>
      <Modal isOpen={true}>
        <div style={styles.flexRow}>
          <span style={styles.title}>Manutenção de notas</span>
          <button
            className="waves-effect waves-light btn red dark-4"
            onClick={handleModalClose}
          >
            X
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="input-field">
            <input type="text" id="inputName" value={student} readOnly />
            <label htmlFor="inputName" className="active">
              Nome do Aluno:
            </label>
          </div>

          <div className="input-field">
            <input type="text" id="inputSubject" value={subject} readOnly />
            <label htmlFor="inputSubject" className="active">
              Disciplina:
            </label>
          </div>

          <div className="input-field">
            <input type="text" id="inputType" value={type} readOnly />
            <label htmlFor="inputType" className="active">
              Tipo de avaliação:
            </label>
          </div>

          <div className="input-field">
            <input
              type="number"
              id="inputGrade"
              min={gradeValidation.minValue}
              max={gradeValidation.maxValue}
              step="1"
              value={gradeValue}
              onChange={handleGradeChange}
            />
            <label htmlFor="inputGrade" className="active">
              Nota:
            </label>
          </div>

          <div style={styles.flexRow}>
            <button
              className="waves-effect waves-light btn"
              disabled={errorMessage.trim() !== ''}
            >
              Salvar
            </button>
            <span style={styles.errorMessage}>{errorMessage}</span>
          </div>
        </form>
      </Modal>
    </div>
  );
}

const styles = {
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '40px',
  },
  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
  },
  title: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
  },
};
