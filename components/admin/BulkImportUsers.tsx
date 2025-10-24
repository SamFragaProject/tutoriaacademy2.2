import React, { useState, useCallback } from 'react';
import { Upload, Download, CheckCircle, AlertCircle, X, FileText, Loader2 } from 'lucide-react';
import { PrimaryButton, SecondaryButton, Card, Chip } from '../ui';
import { useToast } from '../../contexts/ToastContext';
import * as adminUsersSvc from '../../services/adminUsers';
import type { User } from '../../types';

interface BulkImportUsersProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface CSVRow {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  role: string;
  gradeLevel?: string;
  schoolId?: string;
  groupIds?: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: Array<{ row: number; data: any; error: string }>;
}

const BulkImportUsers: React.FC<BulkImportUsersProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState<'upload' | 'validate' | 'preview' | 'import' | 'result'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCSVData] = useState<CSVRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  
  const { showToast } = useToast();

  // Template CSV
  const downloadTemplate = () => {
    const template = `email,firstName,lastName,password,role,gradeLevel,schoolId,groupIds
juan.perez@example.com,Juan,Pérez,Pass123!,student,preparatoria,school-1,group-1
maria.garcia@example.com,María,García,,student,preparatoria,school-1,"group-1;group-2"
carlos.lopez@example.com,Carlos,López,Profe456!,teacher,,school-1,
ana.martinez@example.com,Ana,Martínez,Admin789!,admin,,,`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'plantilla_usuarios.csv';
    link.click();
    
    showToast('Plantilla descargada', 'success');
  };

  // Parse CSV
  const parseCSV = (text: string): CSVRow[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      // Simple CSV parser (handles quoted fields)
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      return row as CSVRow;
    });
  };

  // Validate data
  const validateData = (data: CSVRow[]): ValidationError[] => {
    const errors: ValidationError[] = [];
    const emails = new Set<string>();

    data.forEach((row, index) => {
      const rowNum = index + 2; // +2 because of header and 0-index

      // Email validation
      if (!row.email) {
        errors.push({ row: rowNum, field: 'email', message: 'Email requerido' });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        errors.push({ row: rowNum, field: 'email', message: 'Email inválido' });
      } else if (emails.has(row.email)) {
        errors.push({ row: rowNum, field: 'email', message: 'Email duplicado en CSV' });
      } else {
        emails.add(row.email);
      }

      // First name validation
      if (!row.firstName) {
        errors.push({ row: rowNum, field: 'firstName', message: 'Nombre requerido' });
      }

      // Last name validation
      if (!row.lastName) {
        errors.push({ row: rowNum, field: 'lastName', message: 'Apellido requerido' });
      }

      // Role validation
      if (!row.role) {
        errors.push({ row: rowNum, field: 'role', message: 'Rol requerido' });
      } else if (!['student', 'teacher', 'admin'].includes(row.role)) {
        errors.push({ row: rowNum, field: 'role', message: 'Rol inválido (student, teacher, admin)' });
      }

      // Password validation (if provided)
      if (row.password && row.password.length < 6) {
        errors.push({ row: rowNum, field: 'password', message: 'Contraseña debe tener al menos 6 caracteres' });
      }
    });

    return errors;
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.csv')) {
      showToast('Solo se permiten archivos CSV', 'error');
      return;
    }

    setFile(uploadedFile);
    
    try {
      const text = await uploadedFile.text();
      const parsed = parseCSV(text);
      setCSVData(parsed);
      
      const errors = validateData(parsed);
      setValidationErrors(errors);
      
      if (errors.length === 0) {
        setStep('preview');
        showToast(`${parsed.length} usuarios listos para importar`, 'success');
      } else {
        setStep('validate');
        showToast(`${errors.length} errores encontrados`, 'warning');
      }
    } catch (err) {
      showToast('Error al leer el archivo', 'error');
      console.error(err);
    }
  }, [showToast]);

  // Handle import
  const handleImport = async () => {
    if (csvData.length === 0) return;

    setImporting(true);
    setStep('import');

    try {
      const usersToCreate = csvData.map(row => ({
        name: `${row.firstName} ${row.lastName}`,
        email: row.email,
        role: row.role as any,
        xp: 0,
        accuracy: 0,
        streak: 0,
        activeSubjects: 0,
        examDate: '',
        tokenSavingMode: false,
        career: row.role === 'student' ? 'unam_area1' : undefined,
        masteryScore: 0,
        schoolId: row.schoolId || undefined,
        schoolName: row.schoolId || undefined,
        gradeLevel: row.gradeLevel || undefined,
        password: row.password || undefined,
      }));

      const result = await adminUsersSvc.bulkCreateUsers(usersToCreate as any);
      
      setImportResult({
        total: csvData.length,
        success: result.success.length,
        failed: result.failed.length,
        errors: result.failed
      });

      setStep('result');

      if (result.success.length > 0) {
        showToast(`${result.success.length} usuarios importados exitosamente`, 'success');
        onSuccess();
      }

      if (result.failed.length > 0) {
        showToast(`${result.failed.length} usuarios fallaron`, 'warning');
      }
    } catch (err) {
      showToast('Error al importar usuarios', 'error');
      console.error(err);
    } finally {
      setImporting(false);
    }
  };

  // Download error report
  const downloadErrorReport = () => {
    if (!importResult) return;

    const headers = ['Fila', 'Email', 'Error'];
    const rows = importResult.errors.map(e => [
      e.row || 'N/A',
      e.data?.email || 'N/A',
      e.error
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `errores_importacion_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background-primary rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background-primary border-b border-border p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Importar Usuarios Masivamente</h2>
            <p className="text-text-secondary text-sm mt-1">
              Carga múltiples usuarios desde un archivo CSV
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {['upload', 'preview', 'import', 'result'].map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step === s ? 'border-primary bg-primary text-white' :
                  ['preview', 'import', 'result'].indexOf(step) > i ? 'border-green-500 bg-green-500 text-white' :
                  'border-border bg-background-secondary text-text-secondary'
                }`}>
                  {['preview', 'import', 'result'].indexOf(step) > i ? '✓' : i + 1}
                </div>
                {i < 3 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    ['preview', 'import', 'result'].indexOf(step) > i ? 'bg-green-500' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div className="space-y-6">
              <Card>
                <h3 className="text-lg font-semibold mb-4">Paso 1: Descarga la plantilla</h3>
                <p className="text-text-secondary mb-4">
                  Descarga nuestra plantilla CSV y complétala con los datos de tus usuarios.
                </p>
                <SecondaryButton onClick={downloadTemplate} icon={Download}>
                  Descargar Plantilla CSV
                </SecondaryButton>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold mb-4">Paso 2: Sube tu archivo</h3>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-text-secondary" />
                  <p className="text-text-secondary mb-4">
                    Arrastra tu archivo CSV aquí o haz clic para seleccionar
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload">
                    <SecondaryButton as="span" icon={FileText}>
                      Seleccionar Archivo
                    </SecondaryButton>
                  </label>
                </div>
              </Card>

              <Card className="bg-blue-500/10 border-blue-500">
                <h4 className="font-semibold mb-2">Formato del CSV:</h4>
                <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
                  <li><strong>email</strong>: Email único del usuario (requerido)</li>
                  <li><strong>firstName</strong>: Nombre (requerido)</li>
                  <li><strong>lastName</strong>: Apellido (requerido)</li>
                  <li><strong>password</strong>: Contraseña (opcional, se genera automáticamente)</li>
                  <li><strong>role</strong>: student, teacher, o admin (requerido)</li>
                  <li><strong>gradeLevel</strong>: Nivel escolar (opcional)</li>
                  <li><strong>schoolId</strong>: ID de la escuela (opcional)</li>
                  <li><strong>groupIds</strong>: IDs de grupos separados por ; (opcional)</li>
                </ul>
              </Card>
            </div>
          )}

          {/* Step 2: Validation Errors */}
          {step === 'validate' && (
            <div className="space-y-4">
              <Card className="bg-red-500/10 border-red-500">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Se encontraron {validationErrors.length} errores
                    </h3>
                    <p className="text-text-secondary mb-4">
                      Corrige los siguientes errores en tu archivo CSV y vuelve a cargarlo.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background-secondary">
                      <tr className="border-b border-border">
                        <th className="text-left p-3">Fila</th>
                        <th className="text-left p-3">Campo</th>
                        <th className="text-left p-3">Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {validationErrors.map((error, i) => (
                        <tr key={i} className="border-b border-border">
                          <td className="p-3 font-mono">{error.row}</td>
                          <td className="p-3"><Chip size="sm">{error.field}</Chip></td>
                          <td className="p-3 text-red-500">{error.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <div className="flex justify-between">
                <SecondaryButton onClick={() => setStep('upload')}>
                  Cargar Otro Archivo
                </SecondaryButton>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 'preview' && (
            <div className="space-y-4">
              <Card className="bg-green-500/10 border-green-500">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      ✓ Validación exitosa
                    </h3>
                    <p className="text-text-secondary">
                      {csvData.length} usuarios listos para importar
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold mb-4">Vista previa (primeros 10)</h3>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background-secondary">
                      <tr className="border-b border-border">
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Nombre</th>
                        <th className="text-left p-3">Rol</th>
                        <th className="text-left p-3">Escuela</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.slice(0, 10).map((row, i) => (
                        <tr key={i} className="border-b border-border">
                          <td className="p-3">{row.email}</td>
                          <td className="p-3">{row.firstName} {row.lastName}</td>
                          <td className="p-3">
                            <Chip size="sm" color={
                              row.role === 'admin' ? 'red' :
                              row.role === 'teacher' ? 'purple' : 'cyan'
                            }>
                              {row.role}
                            </Chip>
                          </td>
                          <td className="p-3">{row.schoolId || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {csvData.length > 10 && (
                  <p className="text-text-secondary text-sm mt-4 text-center">
                    ... y {csvData.length - 10} más
                  </p>
                )}
              </Card>

              <div className="flex justify-between">
                <SecondaryButton onClick={() => setStep('upload')}>
                  Cargar Otro Archivo
                </SecondaryButton>
                <PrimaryButton onClick={handleImport}>
                  Importar {csvData.length} Usuarios
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* Step 4: Importing */}
          {step === 'import' && (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-primary" />
              <h3 className="text-xl font-semibold mb-2">Importando usuarios...</h3>
              <p className="text-text-secondary">
                Por favor espera mientras procesamos {csvData.length} usuarios
              </p>
            </div>
          )}

          {/* Step 5: Result */}
          {step === 'result' && importResult && (
            <div className="space-y-4">
              <Card className={importResult.failed === 0 ? 'bg-green-500/10 border-green-500' : 'bg-yellow-500/10 border-yellow-500'}>
                <div className="text-center py-6">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-2xl font-bold mb-2">Importación Completada</h3>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div>
                      <p className="text-3xl font-bold">{importResult.total}</p>
                      <p className="text-text-secondary">Total</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-500">{importResult.success}</p>
                      <p className="text-text-secondary">Exitosos</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-red-500">{importResult.failed}</p>
                      <p className="text-text-secondary">Fallidos</p>
                    </div>
                  </div>
                </div>
              </Card>

              {importResult.failed > 0 && (
                <Card>
                  <h3 className="text-lg font-semibold mb-4">Errores de importación</h3>
                  <div className="overflow-x-auto max-h-64">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-background-secondary">
                        <tr className="border-b border-border">
                          <th className="text-left p-3">Email</th>
                          <th className="text-left p-3">Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importResult.errors.map((error, i) => (
                          <tr key={i} className="border-b border-border">
                            <td className="p-3">{error.data?.email || 'N/A'}</td>
                            <td className="p-3 text-red-500">{error.error}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4">
                    <SecondaryButton onClick={downloadErrorReport} icon={Download}>
                      Descargar Reporte de Errores
                    </SecondaryButton>
                  </div>
                </Card>
              )}

              <div className="flex justify-end gap-2">
                <SecondaryButton onClick={() => {
                  setStep('upload');
                  setFile(null);
                  setCSVData([]);
                  setImportResult(null);
                }}>
                  Importar Más Usuarios
                </SecondaryButton>
                <PrimaryButton onClick={onClose}>
                  Finalizar
                </PrimaryButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkImportUsers;
