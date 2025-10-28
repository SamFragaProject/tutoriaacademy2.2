import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Copy,
  Eye,
  Send,
  Archive,
  Clock,
  Users,
  BarChart
} from "lucide-react";
import { Card, PrimaryButton, SecondaryButton, Chip } from "../ui";
import { useAuth } from "../../hooks/useAuth";
import type { TeacherContent, ContentType, ContentStatus } from "../../types";
import * as contentManagement from "../../services/contentManagement";
import { ContentEditor } from "./ContentEditor";

export const ContentList: React.FC = () => {
  const { user } = useAuth();
  const [contents, setContents] = useState<TeacherContent[]>([]);
  const [filteredContents, setFilteredContents] = useState<TeacherContent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ContentType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<ContentStatus | "all">("all");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<TeacherContent | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadContents();
    }
  }, [user?.id]);

  useEffect(() => {
    filterContents();
  }, [contents, searchTerm, filterType, filterStatus]);

  const loadContents = () => {
    if (!user?.id) return;
    const teacherContents = contentManagement.getTeacherContents(user.id);
    setContents(teacherContents);
  };

  const filterContents = () => {
    let filtered = [...contents];

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(c => c.type === filterType);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    setFilteredContents(filtered);
  };

  const handleCreate = () => {
    setEditingContent(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (content: TeacherContent) => {
    setEditingContent(content);
    setIsEditorOpen(true);
  };

  const handleDelete = (contentId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este contenido?")) {
      contentManagement.deleteContent(contentId);
      loadContents();
    }
  };

  const handleDuplicate = (content: TeacherContent) => {
    const duplicated = contentManagement.duplicateContent(content.id);
    if (duplicated) {
      loadContents();
    }
  };

  const handleArchive = (contentId: string) => {
    contentManagement.archiveContent(contentId);
    loadContents();
  };

  const handleSave = (content: TeacherContent) => {
    loadContents();
    setIsEditorOpen(false);
    setEditingContent(null);
  };

  const getStatusColor = (status: ContentStatus) => {
    switch (status) {
      case "published": return "green";
      case "draft": return "gray";
      case "archived": return "orange";
      default: return "gray";
    }
  };

  const getTypeLabel = (type: ContentType) => {
    const labels: Record<ContentType, string> = {
      task: "Tarea",
      practice: "Repaso",
      exam: "Examen",
      quiz: "Quiz"
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status: ContentStatus) => {
    const labels: Record<ContentStatus, string> = {
      draft: "Borrador",
      published: "Publicado",
      archived: "Archivado"
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Contenido
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Crea y administra tareas, repasos y exámenes
          </p>
        </div>
        <PrimaryButton onClick={handleCreate}>
          <Plus className="w-5 h-5 mr-2" />
          Crear Contenido
        </PrimaryButton>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar contenido..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="task">Tareas</option>
              <option value="practice">Repasos</option>
              <option value="exam">Exámenes</option>
              <option value="quiz">Quizzes</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="draft">Borradores</option>
              <option value="published">Publicados</option>
              <option value="archived">Archivados</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: contents.length, color: "purple" },
          { label: "Publicados", value: contents.filter(c => c.status === "published").length, color: "green" },
          { label: "Borradores", value: contents.filter(c => c.status === "draft").length, color: "gray" },
          { label: "Archivados", value: contents.filter(c => c.status === "archived").length, color: "orange" }
        ].map((stat, idx) => (
          <Card key={idx} className="p-6">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {stat.label}
            </div>
          </Card>
        ))}
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {filteredContents.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No hay contenido aún
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || filterType !== "all" || filterStatus !== "all"
                ? "No se encontraron resultados con los filtros actuales"
                : "Comienza creando tu primer contenido educativo"}
            </p>
            <PrimaryButton onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Contenido
            </PrimaryButton>
          </Card>
        ) : (
          <AnimatePresence>
            {filteredContents.map((content) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {content.title}
                        </h3>
                        <Chip
                          label={getTypeLabel(content.type)}
                          color="purple"
                        />
                        <Chip
                          label={getStatusLabel(content.status)}
                          color={getStatusColor(content.status) as any}
                        />
                      </div>

                      {content.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {content.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>{content.questions.length} preguntas</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BarChart className="w-4 h-4" />
                          <span>{content.totalPoints} puntos</span>
                        </div>
                        {content.dueDate && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              Vence: {new Date(content.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {content.stats && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>
                              {content.stats.completed}/{content.stats.totalAssigned} completados
                            </span>
                          </div>
                        )}
                      </div>

                      {content.tags && content.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {content.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => handleEdit(content)}
                        className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(content)}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors"
                        title="Duplicar"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      {content.status !== "archived" && (
                        <button
                          onClick={() => handleArchive(content.id)}
                          className="p-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 rounded-lg transition-colors"
                          title="Archivar"
                        >
                          <Archive className="w-5 h-5" />
                        </button>
                      )}
                      {content.status === "draft" && (
                        <button
                          onClick={() => handleDelete(content.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Editor Modal */}
      <ContentEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingContent(null);
        }}
        onSave={handleSave}
        editingContent={editingContent}
      />
    </div>
  );
};
