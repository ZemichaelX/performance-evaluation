import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Edit2, Trash2, Save, GripVertical, Search, BookOpen } from 'lucide-react';
import type { CompetencyFramework } from '../../types';

export const FrameworkManagement = () => {
  const { competencyFrameworks, addCompetencyFramework, updateCompetencyFramework, deleteCompetencyFramework } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<CompetencyFramework>({
    id: '',
    name: '',
    description: '',
    questions: []
  });

  const filteredFrameworks = competencyFrameworks.filter(fw =>
    fw.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fw.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (framework: CompetencyFramework) => {
    setEditingId(framework.id);
    setFormData({ ...framework });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      id: `fw-${Date.now()}`,
      name: '',
      description: '',
      questions: []
    });
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.description.trim() || formData.questions.length === 0) {
      alert('Please fill in all required fields and add at least one question');
      return;
    }

    if (isCreating) {
      addCompetencyFramework(formData);
    } else if (editingId) {
      updateCompetencyFramework(editingId, formData);
    }

    setEditingId(null);
    setIsCreating(false);
    setFormData({ id: '', name: '', description: '', questions: [] });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ id: '', name: '', description: '', questions: [] });
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      deleteCompetencyFramework(id);
    }
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { id: `q-${Date.now()}`, category: '', text: '' }
      ]
    });
  };

  const updateQuestion = (index: number, field: 'category' | 'text', value: string) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData({ ...formData, questions: newQuestions });
  };

  const deleteQuestion = (index: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-[44px] opacity-20 blur-xl" />
          <header className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-6 p-8 bg-white/40 backdrop-blur-xl rounded-[48px] border border-white/60 shadow-[0_20px_70px_rgba(0,0,0,0.08)]">
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent tracking-tight leading-tight">
                Competency Frameworks
              </h1>
              <p className="text-slate-600 font-semibold mt-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                Manage evaluation criteria and question templates
              </p>
            </div>
            <button
              onClick={startCreate}
              className="relative group bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-3xl font-black shadow-[0_20px_50px_rgba(99,102,241,0.25)] hover:shadow-[0_20px_60px_rgba(99,102,241,0.4)] hover:scale-[1.02] transition-all duration-300 flex items-center gap-3"
            >
              <Plus className="w-5 h-5" />
              Create Framework
            </button>
          </header>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search frameworks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all"
          />
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingId) && (
          <div className="relative animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="absolute -inset-2 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 rounded-[44px] opacity-30 blur-xl" />
            <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-[40px] border border-indigo-200/50 shadow-lg space-y-6">
              <h2 className="text-2xl font-black text-slate-900">
                {isCreating ? 'Create New Framework' : 'Edit Framework'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Framework Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50"
                    placeholder="e.g., Leadership Competency"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 resize-none"
                    rows={3}
                    placeholder="Describe the purpose and scope of this framework..."
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-bold text-slate-700">Questions * ({formData.questions.length})</label>
                    <button
                      onClick={addQuestion}
                      className="text-indigo-600 text-sm font-bold flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Question
                    </button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {formData.questions.map((q, idx) => (
                      <div key={q.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-start gap-3">
                          <GripVertical className="w-5 h-5 text-slate-400 mt-2 flex-shrink-0" />
                          <div className="flex-1 space-y-3">
                            <input
                              type="text"
                              value={q.category}
                              onChange={(e) => updateQuestion(idx, 'category', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-300"
                              placeholder="Category (e.g., 1.1 Thought Leadership)"
                            />
                            <textarea
                              value={q.text}
                              onChange={(e) => updateQuestion(idx, 'text', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-300 resize-none"
                              rows={2}
                              placeholder="Question text..."
                            />
                          </div>
                          <button
                            onClick={() => deleteQuestion(idx)}
                            className="text-slate-400 hover:text-red-500 p-2 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {formData.questions.length === 0 && (
                      <p className="text-sm text-slate-400 italic text-center py-8">No questions added yet. Click "Add Question" to get started.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-4 border-t border-slate-200">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isCreating ? 'Create Framework' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Framework List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFrameworks.map((framework) => (
            <div key={framework.id} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-[28px] opacity-20 group-hover:opacity-40 blur-lg transition-opacity" />
              <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-[24px] border border-slate-200/50 shadow-lg hover:shadow-xl transition-all space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">{framework.name}</h3>
                  <p className="text-sm text-slate-600 font-semibold line-clamp-2">{framework.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                    {framework.questions.length} Questions
                  </span>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => startEdit(framework)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(framework.id, framework.name)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFrameworks.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-bold text-slate-400">
              {searchTerm ? 'No frameworks found matching your search' : 'No frameworks yet. Create your first one!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
