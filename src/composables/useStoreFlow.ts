// @ts-nocheck
import { reactive } from 'vue'
export function useStoreFlow() {
  const app = reactive<any>({

                isAuthenticated: false,
                showDashboard: true,
                authToken: '',
                currentHuId: null,
                legacyHuData: null,
                huList: [],
                dashboardSearch: '',
                dashboardFolder: '',
                dashboardSprint: '',
                dashboardStatus: '',
                activeTab: 'general',
                sectionOptions: [
                    { id: 'params', label: 'Endpoint', icon: 'fa-network-wired' },
                    { id: 'db', label: 'Modelo DB', icon: 'fa-database' },
                    { id: 'menuPermisos', label: 'Menú y permisos', icon: 'fa-shield-halved' },
                    { id: 'response', label: 'Server & Store', icon: 'fa-server' }
                ],
                unsavedChanges: false,
                huStatus: 'Borrador',
                editorMode: 'create',
                workAreas: ['Frontend', 'Backend', 'SiteBuilder', 'QA', 'Base de datos', 'Diseño UX/UI', 'DevOps', 'Análisis funcional', 'Seguridad'],
                teamMembers: [],
                currentUserId: '',
                currentUserArea: 'Sin área',
                authMode: 'login',
                authName: '',
                authArea: '',
                authEmail: '',
                authPassword: '',
                authError: '',
                searchQuery: '',
                currentUser: '',
                historyLog: [],
                showHistoryModal: false,
                _saveTimer: null,
                _pollTimer: null,
                _saveInFlight: false,
                remoteUpdatedAt: '',
                remoteRevision: 0,
                collabNotice: '',
                collabConflict: false,
                showCreateWorkspace: false,
                showProfileModal: false,
                workspaceSaving: false,
                teamLoading: false,
                workspaceError: '',
                workspaceDraft: { jiraCode: '', name: '', area: '', mode: 'collaborative', assignees: {} },
                subtaskDraft: { title: '', ownerId: '' },
                showMeetingMode: false,
                meetingStep: 0,
                meetingDrafts: { criterion: '', decision: '', question: '' },
                appDialog: { open: false, title: '', message: '', kind: 'info', showCancel: false, confirmText: 'Entendido', cancelText: 'Cancelar' },
                appToast: { visible: false, message: '', kind: 'success' },
                _appDialogResolver: null,
                _toastTimer: null,
                darkMode: true,
                showShareModal: false,
                showJsonModal: false,
                pastedJsonText: '',
                shareTextOutput: '',
                selectedEndpointId: 1,
                huData: {
                    name: "TOURS - Aplicación de propuesta visual",
                    huId: "32312",
                    folder: "Sin carpeta",
                    sprint: "Sin asignar",
                    collaboration: { jiraCode: '', area: '', mode: 'collaborative', subtasks: [] },
                    meta: { 
                        designer: "Juan Sebastian", 
                        documenter: "Karol Navia", 
                        qa: "Andres Ramirez", 
                        qaEmail: "andres.ramirez@virtualsoft.tech",
                        backendDev: "Juan Sebastian Fonseca",
                        frontendDev: "no aplica",
                        siteBuilderRoute: "SiteBuilder-Interacciones-Tours"
                    },
                    designDate: "2026-10-15",
                    qaDate: "2026-10-20",
                    owners: { "Frontend": "No aplica", "Backend": "Juan Sebastian Fonseca" },
                    endpoints: [
                        {
                            id: 1,
                            name: "tours_list",
                            method: "GET",
                            route: "/api/v1/tours",
                            params: [
                                { name: "limit", type: "integer", required: false, description: "Límite de registros" }
                            ]
                        },
                        {
                            id: 2,
                            name: "tours_config",
                            method: "POST",
                            route: "/api/v1/tours/config",
                            params: [
                                { name: "tour_id", type: "string", required: true, description: "Identificador del tour" },
                                { name: "is_active", type: "boolean", required: false, description: "Estado de activación" }
                            ]
                        }
                    ],
                    dbModel: [
                        { action: "Crear", table: "tour_configs", field: "is_active", type: "boolean", description: "Estado de activación" }
                    ],
                    menu: { url: "/tours/config", description: "Configuración de pasos", parent: "Admin", submenu: "Tours" },
                    permissionsList: [
                        { urlApi: "/api/v1/tours/config", description: "Permite gestionar y configurar los tours", parentMenu: "Admin", submenu: "Tours" }
                    ],
                    mockResponse: JSON.stringify({ success: true, data: [] }, null, 2),
                    storeAction: "SiteBuilder -> tourStore.setConfig(data);"
                },
                async init() {
                    const saved = localStorage.getItem('storeflow_hu_single_v22');
                    if (saved) { try { this.huData = JSON.parse(saved); this.legacyHuData = JSON.parse(JSON.stringify(this.huData)); } catch (e) {} }
                    // La plantilla de la reunión también se renderiza cuando está oculta;
                    // asegurar sus datos antes del primer render y después de cargar localStorage.
                    this.ensureMeetingData();
                    if (!this.huData.folder) this.huData.folder = 'Sin carpeta';
                    if (!this.huData.sprint) this.huData.sprint = 'Sin asignar';
                    this.historyLog = [];
                    const darkSaved = localStorage.getItem('storeflow_dark');
                    if (darkSaved !== null) this.darkMode = darkSaved === 'true';
                    try { const session = JSON.parse(localStorage.getItem('storeflow_auth_session') || 'null'); if (session && session.token) { this.authToken = session.token; this.currentUser = session.name || ''; this.currentUserId = session.id || ''; this.currentUserArea = session.area || 'Sin área'; this.isAuthenticated = true; await this.loadHus(); await this.loadTeam(); } } catch (e) { this.logout(); if (e?.status === 401) this.authError = 'Tu sesión venció. Inicia sesión de nuevo.'; }
                },
                get meetingSteps() { return ['Repartir trabajo', 'Acuerdos', 'Resumen']; },
                ensureMeetingData() {
                    if (!this.huData.meeting) this.huData.meeting = {};
                    this.huData.meeting.objective = this.huData.meeting.objective || '';
                    for (const key of ['acceptanceCriteria', 'decisions', 'openQuestions', 'summaries']) if (!Array.isArray(this.huData.meeting[key])) this.huData.meeting[key] = [];
                    if (!this.huData.collaboration) this.huData.collaboration = { jiraCode: '', area: '', mode: 'collaborative', subtasks: [] };
                        if (!this.huData.collaboration.mode) this.huData.collaboration.mode = 'collaborative';
                    if (!Array.isArray(this.huData.collaboration.subtasks)) this.huData.collaboration.subtasks = [];
                },
                openMeetingMode() { this.ensureMeetingData(); this.meetingDrafts = { criterion: '', decision: '', question: '' }; this.meetingStep = 0; this.showMeetingMode = true; },
                addMeetingItem(collection) {
                    this.ensureMeetingData();
                    const draftKey = collection === 'acceptanceCriteria' ? 'criterion' : collection === 'decisions' ? 'decision' : 'question';
                    const text = (this.meetingDrafts[draftKey] || '').trim(); if (!text) return;
                    const entry = { id: (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)), text, author: this.currentUser, createdAt: new Date().toISOString() };
                    this.huData.meeting[collection].push(entry); this.meetingDrafts[draftKey] = ''; this.saveLocal('Agregó contenido a la reunión');
                },
                saveMeetingItem(item) { item.updatedBy = this.currentUser; this.saveLocal('Actualizó un criterio de aceptación'); },
                async removeMeetingItem(collection, index) {
                    const label = collection === 'acceptanceCriteria' ? 'criterio' : collection === 'decisions' ? 'acuerdo' : 'pregunta pendiente';
                    if (!await this.showAppConfirm('Se quitará este elemento del resumen compartido.', { title: 'Eliminar ' + label, confirmText: 'Eliminar' })) return;
                    this.huData.meeting[collection].splice(index, 1); this.saveLocal('Eliminó ' + label);
                },
                async finishMeeting() {
                    if (!await this.showAppConfirm('Se guardará quién cerró la sesión y el estado de los acuerdos, subtareas y preguntas pendientes.', { title: 'Cerrar reunión', confirmText: 'Guardar resumen', kind: 'info' })) return;
                    this.ensureMeetingData();
                    this.huData.meeting.summaries.push({ id: (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)), actor: this.currentUser, createdAt: new Date().toISOString(), taskCount: this.huData.collaboration.subtasks.length, decisionsCount: this.huData.meeting.decisions.length, openQuestionsCount: this.huData.meeting.openQuestions.length, summary: this.meetingSummaryText() });
                    this.saveLocal('Guardó el resumen de reunión'); clearTimeout(this._saveTimer); await this.saveCurrentHu(true, true);
                    if (this.unsavedChanges || this.collabConflict) { this.showAppNotice('El resumen quedó en esta sesión, pero todavía no pudo guardarse en el servidor. Recarga o revisa la conexión antes de cerrar.', { title: 'No se sincronizó el resumen', kind: 'danger' }); return; }
                    this.showMeetingMode = false; this.showToast('Resumen de reunión guardado');
                },
                meetingSummaryText() {
                    this.ensureMeetingData();
                    const jira = this.huData.collaboration.jiraCode || this.huData.huId || 'HU';
                    const list = (items, empty) => items.length ? items.map(item => '- ' + (typeof item === 'string' ? item : item.text)).join('\n') : '- ' + empty;
                    const tasks = this.huData.collaboration.subtasks.map(task => `- ${task.title} | ${task.area || 'Sin área'} | ${task.owner || 'Sin responsable'} | ${task.status || 'Pendiente'}`).join('\n') || '- Sin subtareas asignadas';
                    return `RESUMEN DE REUNIÓN — ${jira}\n${this.huData.name}\nÁrea: ${this.huData.collaboration.area || 'Por definir'}\nAlcance y criterios: consultar en Jira\n\nSUBTAREAS Y RESPONSABLES\n${tasks}\n\nACUERDOS\n${list(this.huData.meeting.decisions, 'Sin acuerdos registrados')}\n\nPREGUNTAS PENDIENTES\n${list(this.huData.meeting.openQuestions, 'Ninguna')}\n\nPreparado por: ${this.currentUser} · ${new Date().toLocaleString()}`;
                },
                async copyMeetingSummary() {
                    try { await navigator.clipboard.writeText(this.meetingSummaryText()); this.showToast('Resumen copiado'); }
                    catch (_) { this.showAppNotice('No se pudo copiar automáticamente. Selecciona el texto del documento y cópialo manualmente.', { title: 'No se pudo copiar', kind: 'danger' }); }
                },
                showAppNotice(message, options = {}) {
                    this.appDialog = { open: true, title: options.title || (options.kind === 'danger' ? 'No se pudo completar' : 'Información'), message: String(message || ''), kind: options.kind || 'info', showCancel: false, confirmText: options.confirmText || 'Entendido', cancelText: 'Cancelar' };
                    return new Promise(resolve => { this._appDialogResolver = resolve; });
                },
                showAppConfirm(message, options = {}) {
                    this.appDialog = { open: true, title: options.title || '¿Confirmas esta acción?', message: String(message || ''), kind: options.kind || 'danger', showCancel: true, confirmText: options.confirmText || 'Confirmar', cancelText: options.cancelText || 'Cancelar' };
                    return new Promise(resolve => { this._appDialogResolver = resolve; });
                },
                resolveAppDialog(accepted) {
                    if (!this.appDialog.open) return;
                    this.appDialog.open = false;
                    const resolve = this._appDialogResolver; this._appDialogResolver = null;
                    if (resolve) resolve(Boolean(accepted));
                },
                showToast(message, kind = 'success') {
                    clearTimeout(this._toastTimer); this.appToast = { visible: true, message: String(message || ''), kind };
                    this._toastTimer = setTimeout(() => { this.appToast.visible = false; }, 3200);
                },
                get uniqueFolders() { return [...new Set(this.huList.map(h => h.folder).filter(Boolean))].sort((a,b) => a.localeCompare(b)); },
                get uniqueSprints() { return [...new Set(this.huList.map(h => h.sprint).filter(Boolean))].sort((a,b) => a.localeCompare(b)); },
                areaKey(area) { return area.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); },
                areaTask(area) { const tasks = { Frontend: 'Desarrollo frontend', Backend: 'Desarrollo backend', SiteBuilder: 'Implementación en SiteBuilder', QA: 'Pruebas de calidad', 'Base de datos': 'Cambios de base de datos', 'Diseño UX/UI': 'Diseño de experiencia', DevOps: 'Configuración y despliegue', 'Análisis funcional': 'Aclaraciones y validación funcional', Seguridad: 'Revisión de seguridad' }; return tasks[area] || 'Tarea de ' + area; },
                get assignmentRoles() { return this.workAreas.map(area => ({ key: this.areaKey(area), area, label: area, task: this.areaTask(area) })); },
                get filteredHus() { const q = this.dashboardSearch.trim().toLowerCase(); return this.huList.filter(h => (!q || (h.title || '').toLowerCase().includes(q) || (h.jira_code || '').toLowerCase().includes(q) || (h.hu_code || '').toLowerCase().includes(q)) && (!this.dashboardFolder || h.folder === this.dashboardFolder) && (!this.dashboardSprint || h.sprint === this.dashboardSprint) && (!this.dashboardStatus || h.status === this.dashboardStatus)); },
                formatDate(value) { if (!value) return '—'; const d = new Date(value.replace(' ', 'T')); return Number.isNaN(d.getTime()) ? value : d.toLocaleString(); },
                async loadHus() { this.huList = await this.apiRequest('hu/index'); },
                async loadTeam() { this.teamMembers = await this.apiRequest('hu/team'); const me = this.teamMembers.find(member => member.id === this.currentUserId); if (me) this.currentUserArea = me.area || 'Sin área'; },
                membersForArea(area) { return this.teamMembers.filter(member => member.area === area); },
                async saveMyArea() { try { const result = await this.apiRequest('hu/profile', 'POST', { area: this.currentUserArea }); this.currentUserArea = result.area; const session = JSON.parse(localStorage.getItem('storeflow_auth_session') || '{}'); session.area = result.area; localStorage.setItem('storeflow_auth_session', JSON.stringify(session)); await this.loadTeam(); this.showProfileModal = false; this.showToast('Perfil actualizado'); } catch (error) { this.showAppNotice(error.message || 'No se pudo actualizar el área.', { kind: 'danger' }); } },
                async createNewHu() {
                    try { await this.loadTeam(); } catch (error) { await this.showAppNotice(error.message || 'No se pudo cargar el equipo.'); return; }
                    if (!this.currentUserArea || this.currentUserArea === 'Sin área') { this.showProfileModal = true; await this.showAppNotice('Esta cuenta se creó antes de guardar el área. Selecciónala una vez en Perfil; luego aparecerá automáticamente en cada espacio.', { title: 'Completa tu perfil' }); return; }
                    const assignees = Object.fromEntries(this.assignmentRoles.map(role => [role.key, '']));
                    this.workspaceDraft = { jiraCode: '', name: '', area: this.workAreas.includes(this.currentUserArea) ? this.currentUserArea : '', mode: 'collaborative', assignees };
                    this.workspaceError = ''; this.workspaceSaving = false; this.teamLoading = true; this.showCreateWorkspace = true;
                    try {
                        if (this.workAreas.includes(this.currentUserArea)) this.workspaceDraft.area = this.currentUserArea;
                        const ownRole = this.assignmentRoles.find(role => role.area === this.currentUserArea);
                        if (ownRole && this.currentUserId) this.workspaceDraft.assignees[ownRole.key] = this.currentUserId;
                    } catch (error) { this.workspaceError = error.message || 'No se pudo cargar el equipo.'; }
                    finally { this.teamLoading = false; }
                },                buildInitialSubtasks(mode, assignees = {}) {
                    if (mode !== 'collaborative') return [];
                    return this.assignmentRoles.map(role => {
                        const member = this.teamMembers.find(person => person.id === assignees[role.key]);
                        return member ? { id: (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + role.key), role: role.key, title: role.task, area: role.area, owner: member.name, ownerId: member.id, status: 'Pendiente', updatedBy: this.currentUser } : null;
                    }).filter(Boolean);
                },
                async createWorkspace() {
                    this.workspaceError = '';
                    const jiraCode = this.workspaceDraft.jiraCode.trim().toUpperCase();
                    const title = this.workspaceDraft.name.trim();
                    const area = this.currentUserArea.trim();
                    const mode = this.workspaceDraft.mode === 'individual' ? 'individual' : 'collaborative';
                    if (!jiraCode || !title || !area || area === 'Sin área') { this.workspaceError = 'Completa el número y nombre de la HU, y verifica el área de tu perfil.'; return; }
                    this.workspaceSaving = true;
                    try {
                        await this.loadHus();
                        const matches = this.huList.filter(item => (item.jira_code || '').trim().toUpperCase() === jiraCode).sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
                        if (matches.length) {
                            this.showCreateWorkspace = false; this.showDashboard = false; this.workspaceSaving = false;
                            await this.openHu(matches[0]);
                            this.collabNotice = matches.length > 1 ? 'Te uniste al espacio compartido. Encontré ' + matches.length + ' espacios duplicados con este código.' : 'Te uniste al espacio compartido de ' + jiraCode + '.';
                            this.workspaceDraft = { jiraCode: '', name: '', area: '', mode: 'collaborative', assignees: {} };
                            return;
                        }
                        const subtasks = this.buildInitialSubtasks(mode, this.workspaceDraft.assignees);
                        const participantIds = [...new Set(subtasks.map(task => task.ownerId).filter(Boolean))];
                        const owners = Object.fromEntries(subtasks.map(task => [task.area, task.owner]));
                        const assigned = key => subtasks.find(task => task.role === key)?.owner || '';
                        const data = { name: title, huId: jiraCode, folder: 'Sin carpeta', sprint: 'Sin asignar', sectionSettings: { params: true, db: true, menuPermisos: true, response: true }, collaboration: { jiraCode, area, mode, participantIds, subtasks }, meeting: { objective: '', acceptanceCriteria: [], decisions: [], openQuestions: [], summaries: [] }, meta: { designer: assigned('design'), documenter: '', qa: assigned('qa'), qaEmail: '', backendDev: assigned('backend'), frontendDev: assigned('frontend'), siteBuilderRoute: '' }, designDate: '', qaDate: '', owners, endpoints: [{ id: 1, name: 'endpoint_nuevo', method: 'GET', route: '/api/v1/', params: [] }], dbModel: [], menu: { url: '', description: '', parent: '', submenu: '' }, permissionsList: [], mockResponse: '{}', storeAction: '' };
                        const created = await this.apiRequest('hu/create', 'POST', { title, folder: 'Sin carpeta', sprint: 'Sin asignar', status: 'Borrador', data });
                        this.currentHuId = created.id; this.showCreateWorkspace = false; this.showDashboard = false; this.editorMode = 'edit'; this.unsavedChanges = false;
                        this.workspaceDraft = { jiraCode: '', name: '', area: '', mode: 'collaborative', assignees: {} };
                        await this.openHu({ id: created.id }); await this.loadHus();
                        this.collabNotice = created.existing ? 'Te uniste al espacio compartido de ' + jiraCode + '.' : (mode === 'individual' ? 'Espacio individual creado para ' + jiraCode + '.' : 'Espacio colaborativo creado. Las tareas asignadas se sincronizan con el equipo.');
                    } catch (error) { this.workspaceError = error.message || 'No se pudo crear el espacio.'; }
                    finally { this.workspaceSaving = false; }
                },
                importLegacyHu() { if (!this.legacyHuData) return; this.huData = JSON.parse(JSON.stringify(this.legacyHuData)); this.huData.huId = ''; this.currentHuId = null; this.huStatus = 'Borrador'; this.editorMode = 'create'; this.showDashboard = false; this.unsavedChanges = true; },
                isSectionEnabled(id) { return id === 'general' || this.huData.sectionSettings?.[id] !== false; },
                ensureSectionSettings() { if (!this.huData.sectionSettings || typeof this.huData.sectionSettings !== 'object') this.huData.sectionSettings = {}; this.sectionOptions.forEach(section => { if (typeof this.huData.sectionSettings[section.id] !== 'boolean') this.huData.sectionSettings[section.id] = true; }); },
                setSectionEnabled(id, enabled) { this.ensureSectionSettings(); this.huData.sectionSettings[id] = Boolean(enabled); if (!enabled && this.activeTab === id) this.activeTab = this.sectionOptions.find(section => this.huData.sectionSettings[section.id])?.id || 'general'; this.saveLocal('Actualizó las secciones visibles de la HU'); },
                async openHu(item) {
                    try {
                        this.stopCollabPolling();
                        const doc = await this.apiRequest('hu/show/' + encodeURIComponent(item.id));
                        this.currentHuId = doc.id; this.huData = doc.data; this.huData.huId = doc.hu_code; this.huData.name = doc.title; this.huData.folder = doc.folder; this.huData.sprint = doc.sprint; this.huStatus = doc.status;
                        if (!this.huData.collaboration) this.huData.collaboration = { jiraCode: '', area: '', mode: 'collaborative', subtasks: [] };
                        this.ensureSectionSettings(); this.activeTab = 'general';
                        if (!this.huData.collaboration.mode) this.huData.collaboration.mode = 'collaborative';
                        if (!Array.isArray(this.huData.collaboration.subtasks)) this.huData.collaboration.subtasks = [];
                        if (!Array.isArray(this.huData.collaboration.participantIds)) this.huData.collaboration.participantIds = [];
                        this.huData.collaboration.subtasks.forEach(task => { if (task.ownerId && !this.huData.collaboration.participantIds.includes(task.ownerId)) this.huData.collaboration.participantIds.push(task.ownerId); });
                        if (!this.huData.meeting) this.huData.meeting = { objective: '', acceptanceCriteria: [], decisions: [], openQuestions: [], summaries: [] };
                        if (!Array.isArray(this.huData.meeting.acceptanceCriteria)) this.huData.meeting.acceptanceCriteria = [];
                        if (!Array.isArray(this.huData.meeting.decisions)) this.huData.meeting.decisions = [];
                        if (!Array.isArray(this.huData.meeting.openQuestions)) this.huData.meeting.openQuestions = [];
                        if (!Array.isArray(this.huData.meeting.summaries)) this.huData.meeting.summaries = [];
                        if (!Array.isArray(this.huData.endpoints) || !this.huData.endpoints.length) this.huData.endpoints = [{ id: 1, name: 'endpoint_nuevo', method: 'GET', route: '/api/v1/', params: [] }];
                        this.remoteUpdatedAt = doc.updated_at; this.remoteRevision = Number(doc.revision_no || 0); this.collabNotice = ''; this.collabConflict = false;
                        this.editorMode = 'edit'; this.unsavedChanges = false; this.selectedEndpointId = this.huData.endpoints?.[0]?.id || 1; this.showDashboard = false; this.startCollabPolling();
                    } catch (error) { this.showAppNotice(error.message, { kind: 'danger' }); }
                },
                async saveCurrentHu(quiet = false, createVersion = !quiet) {
                    if (!this.currentHuId) return;
                    if (this._saveInFlight) { clearTimeout(this._saveTimer); this._saveTimer = setTimeout(() => this.saveCurrentHu(quiet, createVersion), 500); return; }
                    this._saveInFlight = true;
                    try {
                        const payload = { title: this.huData.name.trim(), folder: this.huData.folder || 'Sin carpeta', sprint: this.huData.sprint || 'Sin asignar', status: this.huStatus || 'Borrador', data: this.huData, expected_revision: this.remoteRevision, create_version: createVersion };
                        const result = await this.apiRequest('hu/update/' + encodeURIComponent(this.currentHuId), 'PUT', payload);
                        this.remoteUpdatedAt = result.updated_at || this.remoteUpdatedAt; this.remoteRevision = Number(result.revision_no || this.remoteRevision); this.unsavedChanges = false; this.collabConflict = false; this.collabNotice = '';
                        localStorage.setItem('storeflow_hu_single_v22', JSON.stringify(this.huData)); await this.loadHus();
                        if (!quiet) await this.showAppNotice('La HU quedó guardada en el espacio compartido y ya está disponible para el equipo.', { title: 'Guardado correctamente', kind: 'success' });
                    } catch (error) {
                        if ((error.message || '').includes('Otra persona guardó cambios')) { this.collabConflict = true; this.collabNotice = 'Hay cambios de otra persona. Recarga para verlos.'; clearTimeout(this._saveTimer); }
                        else { this.collabNotice = 'No se pudo guardar: ' + error.message; if (!quiet) this.showAppNotice(this.collabNotice, { kind: 'danger' }); }
                    } finally { this._saveInFlight = false; }
                },
                async syncCurrentHu() {
                    if (!this.currentHuId || this.showDashboard || this._saveInFlight) return;
                    try {
                        const doc = await this.apiRequest('hu/show/' + encodeURIComponent(this.currentHuId));
                        if (Number(doc.revision_no || 0) <= this.remoteRevision) return;
                        if (this.unsavedChanges) { this.collabConflict = true; this.collabNotice = 'Otra persona actualizó la HU; recarga para revisar sus cambios.'; clearTimeout(this._saveTimer); return; }
                        this.huData = doc.data; this.huData.name = doc.title; this.huData.huId = doc.hu_code; this.huData.folder = doc.folder; this.huData.sprint = doc.sprint; this.huStatus = doc.status;
                        this.ensureMeetingData();
                        this.remoteUpdatedAt = doc.updated_at; this.remoteRevision = Number(doc.revision_no || 0); this.collabConflict = false; this.collabNotice = 'Actualizado por el equipo';
                        setTimeout(() => { if (!this.unsavedChanges) this.collabNotice = ''; }, 2500);
                    } catch (_) { /* La siguiente consulta periódica volverá a intentar */ }
                },
                startCollabPolling() { this.stopCollabPolling(); this._pollTimer = setInterval(() => this.syncCurrentHu(), 2500); },
                stopCollabPolling() { if (this._pollTimer) clearInterval(this._pollTimer); this._pollTimer = null; },
                async reloadSharedChanges() { this.collabConflict = false; this.unsavedChanges = false; await this.openHu({ id: this.currentHuId }); },
                addSubtask() {
                    if (!this.huData.collaboration) this.huData.collaboration = { jiraCode: '', area: '', mode: 'collaborative', subtasks: [] };
                    if (!this.huData.collaboration.mode) this.huData.collaboration.mode = 'collaborative';
                    if (!Array.isArray(this.huData.collaboration.subtasks)) this.huData.collaboration.subtasks = [];
                    const member = this.teamMembers.find(person => person.id === this.subtaskDraft.ownerId);
                    if (!member) { this.showAppNotice('Selecciona una persona registrada para asignar la tarea.'); return; }
                    this.huData.collaboration.subtasks.push({ id: (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)), title: this.subtaskDraft.title.trim(), area: member.area || 'Sin área', owner: member.name, ownerId: member.id, status: 'Pendiente', updatedBy: this.currentUser });
                    this.subtaskDraft = { title: '', ownerId: '' }; this.syncParticipants(); this.saveLocal('Asignó una subtarea a ' + member.name);
                },
                syncParticipants() { if (!this.huData.collaboration) return; const tasks = this.huData.collaboration.subtasks || []; this.huData.collaboration.participantIds = [...new Set(tasks.map(task => task.ownerId).filter(Boolean))]; },
                assignSubtaskMember(task, memberId) { const member = this.teamMembers.find(person => person.id === memberId); task.ownerId = member?.id || ''; task.owner = member?.name || ''; task.area = member?.area || ''; task.updatedBy = this.currentUser; this.syncParticipants(); this.saveLocal('Actualizó responsable de una subtarea'); },
                saveSubtask(task) { task.updatedBy = this.currentUser; this.saveLocal('Actualizó una subtarea'); },
                async removeSubtask(index) { if (!await this.showAppConfirm('La subtarea se quitará del espacio compartido.', { title: 'Eliminar subtarea', confirmText: 'Eliminar' })) return; this.huData.collaboration.subtasks.splice(index, 1); this.syncParticipants(); this.saveLocal('Eliminó una subtarea'); this.showToast('Subtarea eliminada'); },
                async backToDashboard() {
                    if (this.unsavedChanges && this.currentHuId && !this.collabConflict) { clearTimeout(this._saveTimer); await this.saveCurrentHu(true, true); }
                    if (this.unsavedChanges && !await this.showAppConfirm('Hay cambios locales que no se pudieron sincronizar. Si vuelves al panel, se descartarán.', { title: 'Cambios sin sincronizar', confirmText: 'Descartar y volver' })) return;
                    clearTimeout(this._saveTimer); this.stopCollabPolling(); this.showDashboard = true; this.unsavedChanges = false; this.loadHus().catch(e => this.showAppNotice(e.message, { kind: 'danger' }));
                },
                async deleteHu(item) { if (!await this.showAppConfirm('La HU dejará de aparecer en el panel. Su historial de auditoría se conservará.', { title: 'Eliminar ' + (item.jira_code || item.hu_code), confirmText: 'Eliminar' })) return; try { await this.apiRequest('hu/delete/' + encodeURIComponent(item.id), 'DELETE'); await this.loadHus(); this.showToast('HU eliminada'); } catch (error) { this.showAppNotice(error.message, { kind: 'danger' }); } },
                async duplicateHu(item) { await this.openHu(item); if (!this.currentHuId) return; this.currentHuId = null; this.huData.huId = ''; this.huData.name += ' (copia)'; this.huStatus = 'Borrador'; this.editorMode = 'create'; this.unsavedChanges = true; },
                async loadHistory() { if (!this.currentHuId) { this.showAppNotice('Guarda la HU primero para consultar su historial compartido.'); return; } try { const rows = await this.apiRequest('hu/versions/' + encodeURIComponent(this.currentHuId)); this.historyLog = rows.map(v => ({ id: v.id, version: v.version_no, createdAt: v.created_at, user: v.actor_name, action: v.action, snapshot: v.snapshot })); this.showHistoryModal = true; } catch (error) { this.showAppNotice(error.message, { kind: 'danger' }); } },
                get filteredEndpoints() {
                    if (!this.searchQuery) return this.huData.endpoints;
                    const q = this.searchQuery.toLowerCase();
                    return this.huData.endpoints.filter(e => e.name.toLowerCase().includes(q) || e.route.toLowerCase().includes(q));
                },
                get currentEndpoint() {
                    return this.huData.endpoints.find(e => e.id === this.selectedEndpointId) || this.huData.endpoints[0];
                },
                isCurrentEndpoint(ep) {
                    return this.currentEndpoint === ep;
                },
                selectEndpoint(ep) {
                    this.selectedEndpointId = ep.id;
                },
                apiUrl(route) { const configured = import.meta.env.VITE_API_BASE_URL || '/store/backend_store/public/index.php'; const external = configured.startsWith('http://') || configured.startsWith('https://'); const base = external ? configured : new URL(configured, location.origin).toString(); return base + '?route=' + encodeURIComponent(route); },
                async apiRequest(route, method = 'GET', payload = null) {
                    const headers = {}; if (this.authToken) headers.Authorization = 'Bearer ' + this.authToken;
                    const options = { method, headers };
                    if (payload !== null) { headers['Content-Type'] = 'application/json'; options.body = JSON.stringify(payload); }
                    const response = await fetch(this.apiUrl(route), options);
                    const raw = await response.text();
                    let result;
                    try { result = JSON.parse(raw); }
                    catch (e) { const preview = raw.replace(/\s+/g, ' ').slice(0, 180); throw new Error('Respuesta no JSON (' + response.status + ', ' + (response.headers.get('content-type') || 'sin Content-Type') + '): ' + (preview || 'sin contenido')); }
                    if (!response.ok || result.status === 'error') { const error = new Error(result.message || 'No se pudo completar la solicitud.'); error.status = response.status; if (response.status === 401 && this.authToken) this.logout(); throw error; }
                    return result.message;
                },
                async submitAuth() {
                    this.authError = '';
                    try {
                        const route = this.authMode === 'register' ? 'hu/register' : 'hu/login';
                        const payload = this.authMode === 'register' ? { name: this.authName.trim(), area: this.authArea, email: this.authEmail.trim(), password: this.authPassword } : { identifier: this.authEmail.trim(), password: this.authPassword };
                        const account = await this.apiRequest(route, 'POST', payload);
                        this.authToken = account.token; this.currentUser = account.name; this.currentUserId = account.id; this.currentUserArea = account.area || this.currentUserArea; this.isAuthenticated = true; this.showDashboard = true;
                        localStorage.setItem('storeflow_auth_session', JSON.stringify({ id: account.id, name: account.name, email: account.email, area: account.area, token: account.token }));
                        localStorage.setItem('storeflow_editor_name', account.name); this.authPassword = ''; this.authName = ''; this.authArea = ''; await this.loadHus(); await this.loadTeam();
                    } catch (error) { this.authError = error.message || 'No se pudo conectar con el servidor de HU.'; }
                },
                switchAuthMode(mode) {
                    if (mode === this.authMode) return;
                    this.authMode = mode;
                    this.authName = '';
                    this.authArea = '';
                    this.authEmail = '';
                    this.authPassword = '';
                    this.authError = '';
                },
                logout() {
                    this.stopCollabPolling(); clearTimeout(this._saveTimer); localStorage.removeItem('storeflow_auth_session'); this.authToken = ''; this.isAuthenticated = false; this.showDashboard = true; this.currentUser = ''; this.currentUserId = ''; this.currentUserArea = 'Sin área'; this.huList = []; this.authPassword = ''; this.authMode = 'login';
                },
                saveUser() { localStorage.setItem('storeflow_editor_name', this.currentUser); },
                saveLocal(action = 'Guardó cambios') {
                    this.unsavedChanges = true;
                    localStorage.setItem('storeflow_hu_single_v22', JSON.stringify(this.huData));
                    if (this.currentHuId && !this.collabConflict) {
                        clearTimeout(this._saveTimer);
                        this.collabNotice = 'Guardando cambios…';
                        this._saveTimer = setTimeout(() => this.saveCurrentHu(true), 1200);
                    }
                },
                async restoreVersion(version) {
                    if (!await this.showAppConfirm('Se creará una nueva versión con los datos guardados en la versión seleccionada.', { title: 'Restaurar versión ' + version.version, confirmText: 'Restaurar', kind: 'info' })) return;
                    try { await this.apiRequest('hu/restore/' + encodeURIComponent(this.currentHuId) + '/' + version.version, 'POST', {}); await this.openHu({ id: this.currentHuId }); await this.loadHus(); this.showHistoryModal = false; this.showToast('Versión restaurada'); }
                    catch (error) { this.showAppNotice(error.message, { kind: 'danger' }); }
                },
                toggleDarkMode() {
                    this.darkMode = !this.darkMode;
                    localStorage.setItem('storeflow_dark', this.darkMode);
                },
                hasArea(areaName) {
                    return this.huData.owners && Object.prototype.hasOwnProperty.call(this.huData.owners, areaName);
                },
                toggleArea(areaName) {
                    if (!this.huData.owners) this.huData.owners = {};
                    if (this.hasArea(areaName)) {
                        delete this.huData.owners[areaName];
                    } else {
                        this.huData.owners[areaName] = "Responsable " + areaName;
                    }
                    this.saveLocal();
                },
                addEndpoint() {
                    const newId = this.huData.endpoints.length ? Math.max(...this.huData.endpoints.map(e => e.id)) + 1 : 1;
                    this.huData.endpoints.push({
                        id: newId,
                        name: "endpoint_" + newId,
                        method: "POST",
                        route: "/api/v1/nuevo",
                        params: [{ name: "id", type: "string", required: true, description: "ID de prueba" }]
                    });
                    this.selectedEndpointId = newId;
                    this.saveLocal();
                },
                async removeEndpoint(ep) {
                    if (this.huData.endpoints.length <= 1) {
                        this.showAppNotice('La HU debe mantener al menos un endpoint.');
                        return;
                    }
                    if (await this.showAppConfirm(`Se quitará ${ep.name} (${ep.route}) del diseño técnico.`, { title: 'Eliminar endpoint', confirmText: 'Eliminar' })) {
                        const idx = this.huData.endpoints.indexOf(ep);
                        if (idx !== -1) {
                            this.huData.endpoints.splice(idx, 1);
                            this.selectedEndpointId = this.huData.endpoints[0].id;
                            this.saveLocal('Eliminó endpoint ' + ep.name + ' (' + ep.route + ')');
                            this.showToast('Endpoint eliminado');
                        }
                    }
                },
                addParam() {
                    if (!this.currentEndpoint.params) this.currentEndpoint.params = [];
                    this.currentEndpoint.params.push({ name: "nuevo_campo", type: "string", required: false, description: "Descripción" });
                    this.saveLocal();
                },
                async removeParam(pIdx) {
                    const paramName = this.currentEndpoint.params[pIdx].name;
                    if (await this.showAppConfirm(`Se eliminará la variable ${paramName} del endpoint.`, { title: 'Eliminar variable', confirmText: 'Eliminar' })) {
                        this.currentEndpoint.params.splice(pIdx, 1);
                        this.saveLocal('Eliminó parámetro ' + paramName);
                        this.showToast('Variable eliminada');
                    }
                },
                importJsonToParams() {
                    try {
                        const parsed = JSON.parse(this.pastedJsonText);
                        if (!this.currentEndpoint.params) this.currentEndpoint.params = [];
                        
                        Object.keys(parsed).forEach(key => {
                            let val = parsed[key];
                            let type = typeof val;
                            if (type === 'number') type = 'integer';
                            
                            this.currentEndpoint.params.push({
                                name: key,
                                type: type,
                                required: true,
                                description: `Importado de JSON`
                            });
                        });
                        
                        this.saveLocal();
                        this.showJsonModal = false;
                        this.pastedJsonText = '';
                        this.showToast('Variables importadas correctamente');
                    } catch (e) {
                        this.showAppNotice('El JSON no tiene un formato válido. Revisa la estructura e inténtalo de nuevo.', { title: 'No se pudo importar', kind: 'danger' });
                    }
                },
                addPermission() {
                    if (!this.huData.permissionsList) this.huData.permissionsList = [];
                    this.huData.permissionsList.push({ urlApi: "/api/v1/", description: "Nuevo permiso", parentMenu: "Admin", submenu: "General" });
                    this.saveLocal();
                },
                async removePermission(pIdx) {
                    if (await this.showAppConfirm('El permiso se quitará de esta HU.', { title: 'Eliminar permiso', confirmText: 'Eliminar' })) {
                        this.huData.permissionsList.splice(pIdx, 1);
                        this.saveLocal('Eliminó permiso');
                        this.showToast('Permiso eliminado');
                    }
                },
                addDbField() {
                    if (!this.huData.dbModel) this.huData.dbModel = [];
                    this.huData.dbModel.push({ action: "Modificar", table: "nombre_tabla", field: "campo_nuevo", type: "varchar", description: "Modificación de esquema" });
                    this.saveLocal();
                },
                async removeDbField(dIdx) {
                    if (await this.showAppConfirm('El campo se quitará del modelo de datos de esta HU.', { title: 'Eliminar campo del modelo', confirmText: 'Eliminar' })) {
                        this.huData.dbModel.splice(dIdx, 1);
                        this.saveLocal('Eliminó campo de base de datos');
                        this.showToast('Campo eliminado del modelo');
                    }
                },
                async exportToExcelReal() {
                    const hu = this.huData;
                    if (typeof ExcelJS === 'undefined') { await this.showAppNotice('No se cargó el generador de Excel. Verifica la conexión a internet e inténtalo de nuevo.', { title: 'No se pudo exportar', kind: 'danger' }); return; }
                    try {
                        const wb = new ExcelJS.Workbook();
                        const theme = { ink: '1F2937', muted: '64748B', line: 'DCE3ED', paper: 'FFFFFF', alt: 'F8FAFC', indigo: '4F46E5', indigoDark: '3730A3', indigoLight: 'EEF2FF', indigoTint: 'E0E7FF', green: '047857', greenLight: 'ECFDF5', teal: '0B8F60', orange: 'C2410C', orangeLight: 'FFF7ED' };
                        const clean = value => value === undefined || value === null || value === '' ? '—' : String(value);
                        const formatJson = value => { if (value === undefined || value === null || value === '') return '—'; try { return typeof value === 'string' ? JSON.stringify(JSON.parse(value), null, 2) : JSON.stringify(value, null, 2); } catch (_) { return String(value); } };
                        const enabled = key => hu.sectionSettings?.[key] !== false;
                        const sharedTasks = hu.collaboration?.subtasks || [];
                        const meta = hu.meta || {};
                        const menu = hu.menu || {};
                        const sectionNames = [
                            { id: 'params', label: 'Endpoints' }, { id: 'db', label: 'Modelo DB' },
                            { id: 'menuPermisos', label: 'Menú y permisos' }, { id: 'response', label: 'Server & Store' }
                        ];
                        wb.creator = 'StoreFlow Studio'; wb.lastModifiedBy = this.currentUser || 'StoreFlow Studio'; wb.created = new Date(); wb.modified = new Date();

                        const baseSheet = (name, tabColor, widths) => {
                            const ws = wb.addWorksheet(name, { properties: { tabColor: { argb: 'FF' + tabColor } }, views: [{ showGridLines: false }] });
                            ws.columns = widths.map(width => ({ width }));
                            ws.pageSetup = { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0, paperSize: 9, margins: { left: 0.25, right: 0.25, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 } };
                            ws.headerFooter = { oddFooter: '&LStoreFlow Studio&C' + clean(hu.huId) + '&R&P de &N' };
                            return ws;
                        };
                        const fill = color => ({ type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + color } });
                        const border = { bottom: { style: 'thin', color: { argb: 'FF' + theme.line } } };
                        const titleBlock = (ws, title, subtitle, lastCol) => {
                            ws.mergeCells(1, 1, 1, lastCol); ws.getCell(1, 1).value = title.toUpperCase();
                            ws.getRow(1).height = 34; ws.getRow(1).font = { name: 'Aptos Display', size: 18, bold: true, color: { argb: 'FFFFFFFF' } }; ws.getRow(1).fill = fill(theme.indigo); ws.getRow(1).alignment = { vertical: 'middle', indent: 1 };
                            ws.mergeCells(2, 1, 2, lastCol); ws.getCell(2, 1).value = subtitle;
                            ws.getRow(2).height = 23; ws.getRow(2).font = { name: 'Aptos', size: 10, color: { argb: 'FF4338CA' } }; ws.getRow(2).fill = fill(theme.indigoLight); ws.getRow(2).alignment = { vertical: 'middle', indent: 1 };
                            ws.getRow(3).height = 9;
                        };
                        const sectionBand = (ws, rowNo, label, lastCol, bg = theme.indigoLight, fg = theme.indigoDark) => {
                            ws.mergeCells(rowNo, 1, rowNo, lastCol); const cell = ws.getCell(rowNo, 1); cell.value = label.toUpperCase(); cell.fill = fill(bg); cell.font = { name: 'Aptos', size: 10, bold: true, color: { argb: 'FF' + fg } }; cell.alignment = { vertical: 'middle', indent: 1 }; ws.getRow(rowNo).height = 23;
                        };
                        const styleTable = (ws, headerRow, endRow, headers, accent = theme.indigo) => {
                            ws.getRow(headerRow).height = 27;
                            ws.getRow(headerRow).eachCell((cell, colNo) => { if (colNo <= headers.length) { cell.fill = fill(accent); cell.font = { name: 'Aptos', size: 10, bold: true, color: { argb: 'FFFFFFFF' } }; cell.alignment = { vertical: 'middle', wrapText: true }; cell.border = border; } });
                            for (let rowNo = headerRow + 1; rowNo <= endRow; rowNo++) {
                                const row = ws.getRow(rowNo); row.height = 24;
                                row.eachCell((cell, colNo) => { if (colNo <= headers.length) { cell.fill = fill(rowNo % 2 ? theme.alt : theme.paper); cell.font = { name: 'Aptos', size: 10, color: { argb: 'FF' + theme.ink } }; cell.alignment = { vertical: 'top', wrapText: true }; cell.border = border; } });
                            }
                            if (endRow > headerRow) ws.autoFilter = { from: { row: headerRow, column: 1 }, to: { row: endRow, column: headers.length } };
                        };
                        const tableSheet = (name, title, subtitle, headers, rows, widths, tabColor = theme.indigo) => {
                            const ws = baseSheet(name, tabColor, widths); titleBlock(ws, title, subtitle, headers.length);
                            const headerRow = 4; ws.addRow([]); ws.addRow(headers); const dataRows = rows.length ? rows : [headers.map((_, i) => i === 0 ? 'Sin registros para esta HU' : '')];
                            dataRows.forEach(row => ws.addRow(row)); styleTable(ws, headerRow, headerRow + dataRows.length, headers, tabColor); ws.views = [{ state: 'frozen', ySplit: headerRow, showGridLines: false }];
                            return ws;
                        };

                        // Resumen: mantiene el estilo de la maqueta compartida.
                        const summary = baseSheet('Resumen HU', theme.teal, [20, 27, 20, 27, 20, 27]);
                        titleBlock(summary, 'StoreFlow Studio · ' + clean(hu.name), 'DOCUMENTO DE TRABAJO  ·  HU ' + clean(hu.huId) + '  ·  Jira ' + clean(hu.collaboration?.jiraCode || hu.huId), 6);
                        sectionBand(summary, 4, 'Resumen de la historia', 6);
                        const detailRows = [
                            ['Código Jira', clean(hu.collaboration?.jiraCode || hu.huId), 'Sprint', clean(hu.sprint), 'Estado', clean(this.huStatus)],
                            ['Carpeta', clean(hu.folder), 'Modalidad', hu.collaboration?.mode === 'individual' ? 'Individual' : 'Colaborativa', 'Responsable', clean(this.currentUser)]
                        ];
                        detailRows.forEach((values, idx) => {
                            const rowNo = 5 + idx; summary.addRow(values); summary.getRow(rowNo).height = 26;
                            [1, 3, 5].forEach(col => { const cell = summary.getCell(rowNo, col); cell.font = { name: 'Aptos', size: 10, color: { argb: 'FF' + theme.muted } }; cell.fill = fill('F8FAFC'); });
                            [2, 4, 6].forEach(col => { const cell = summary.getCell(rowNo, col); cell.font = { name: 'Aptos', size: 10, bold: col === 6, color: { argb: 'FF' + theme.ink } }; cell.alignment = { wrapText: true, vertical: 'middle' }; });
                            summary.getRow(rowNo).eachCell(cell => { cell.border = border; });
                        });
                        summary.getCell(5, 6).fill = fill('DBEAFE'); summary.getCell(5, 6).font = { name: 'Aptos', size: 10, bold: true, color: { argb: 'FF1D4ED8' } }; summary.getCell(5, 6).alignment = { horizontal: 'center', vertical: 'middle' };
                        sectionBand(summary, 8, 'Equipo y responsabilidades', 6, theme.greenLight, theme.green);
                        const teamHeaders = ['Área', 'Responsable', 'Tarea / rol', 'Estado', 'Última actualización', '']; summary.addRow(teamHeaders);
                        const teamRows = sharedTasks.map(task => [clean(task.area), clean(task.owner), clean(task.title), clean(task.status), clean(task.updatedBy), '']);
                        if (!teamRows.length) {
                            [['Diseño', meta.designer], ['Documentación', meta.documenter], ['QA', meta.qa], ['Backend', meta.backendDev], ['Frontend', meta.frontendDev], ['SiteBuilder', meta.siteBuilderRoute]].filter(row => row[1]).forEach(row => teamRows.push([row[0], clean(row[1]), row[0] + ' de la HU', '—', '—', '']));
                        }
                        if (!teamRows.length) teamRows.push(['—', 'Sin responsables registrados', '—', '—', '—', '']);
                        const teamHeaderRow = 9; teamRows.forEach(row => summary.addRow(row)); styleTable(summary, teamHeaderRow, teamHeaderRow + teamRows.length, teamHeaders, theme.green);
                        summary.autoFilter = undefined;
                        sectionBand(summary, teamHeaderRow + teamRows.length + 2, 'Contenido del libro', 6);
                        const contentHeader = teamHeaderRow + teamRows.length + 3; summary.addRow(['Pestaña', 'Información', '', 'Estado', '', '']);
                        const contentRows = [
                            ['Endpoints', 'Rutas, métodos HTTP y parámetros', '', enabled('params') ? 'Incluida' : 'No incluida', '', ''],
                            ['Modelo DB', 'Tablas, campos, tipos y descripciones', '', enabled('db') ? 'Incluida' : 'No incluida', '', ''],
                            ['Menú y permisos', 'Menú global y permisos configurados', '', enabled('menuPermisos') ? 'Incluida' : 'No incluida', '', ''],
                            ['Server & Store', 'Acciones Store y respuestas esperadas', '', enabled('response') ? 'Incluida' : 'No incluida', '', '']
                        ];
                        contentRows.forEach(row => summary.addRow(row)); styleTable(summary, contentHeader, contentHeader + contentRows.length, ['Pestaña', 'Información', '', 'Estado', '', ''], theme.indigo);
                        summary.autoFilter = undefined;
                        summary.mergeCells(contentHeader, 2, contentHeader, 3); summary.mergeCells(contentHeader, 4, contentHeader, 6);
                        for (let r = contentHeader + 1; r <= contentHeader + contentRows.length; r++) { summary.mergeCells(r, 2, r, 3); summary.mergeCells(r, 4, r, 6); }
                        const noteRow = contentHeader + contentRows.length + 2; summary.mergeCells(noteRow, 1, noteRow + 2, 6); summary.getCell(noteRow, 1).value = 'Cada tema técnico está organizado en su propia pestaña. El resumen conserva el contexto de la HU y el equipo; solo se exportan las secciones activadas en la HU.'; summary.getCell(noteRow, 1).fill = fill('F8FAFC'); summary.getCell(noteRow, 1).font = { name: 'Aptos', size: 11, bold: true, color: { argb: 'FF' + theme.ink } }; summary.getCell(noteRow, 1).alignment = { wrapText: true, vertical: 'middle', indent: 1 }; summary.getRow(noteRow).height = 28; summary.views = [{ showGridLines: false }];

                        if (enabled('params')) {
                            const rows = [];
                            (hu.endpoints || []).forEach(ep => {
                                const params = Array.isArray(ep.params) ? ep.params : [];
                                if (params.length) params.forEach(param => rows.push([clean(ep.name), clean(ep.method), clean(ep.route), clean(param.name), clean(param.type), param.required ? 'Sí' : 'No', clean(param.description)]));
                                else rows.push([clean(ep.name), clean(ep.method), clean(ep.route), 'Sin parámetros', '—', '—', '—']);
                            });
                            tableSheet('Endpoints', 'Endpoints y parámetros', 'Rutas HTTP y variables asociadas a la HU ' + clean(hu.huId), ['Nombre', 'Método', 'Ruta URL', 'Parámetro', 'Tipo', 'Obligatorio', 'Descripción'], rows, [26, 16, 34, 24, 18, 16, 42]);
                        }
                        if (enabled('db')) {
                            const rows = (hu.dbModel || []).map(item => [clean(item.action), clean(item.table), clean(item.field), clean(item.type), clean(item.description)]);
                            tableSheet('Modelo DB', 'Modelo de base de datos', 'Tablas y columnas creadas o modificadas para esta HU', ['Acción', 'Tabla', 'Campo', 'Tipo de dato', 'Descripción'], rows, [18, 28, 28, 22, 54], theme.indigo);
                        }
                        if (enabled('menuPermisos')) {
                            const ws = baseSheet('Menú y permisos', theme.green, [28, 38, 28, 38]); titleBlock(ws, 'Menú y permisos', 'Configuración global y permisos de acceso de la HU ' + clean(hu.huId), 4);
                            sectionBand(ws, 4, 'Configuración del menú global', 4, theme.greenLight, theme.green); ws.addRow(['Campo', 'Valor', 'Campo', 'Valor']);
                            [['URL Global', clean(menu.url), 'Descripción', clean(menu.description)], ['Menú Padre', clean(menu.parent), 'Submenú', clean(menu.submenu)]].forEach(row => ws.addRow(row)); styleTable(ws, 5, 7, ['Campo', 'Valor', 'Campo', 'Valor'], theme.green);
                            sectionBand(ws, 9, 'Permisos de acceso múltiples', 4); ws.addRow(['URL API del permiso', 'Descripción', 'Menú padre', 'Submenú']);
                            const perms = (hu.permissionsList || []).map(item => [clean(item.urlApi), clean(item.description), clean(item.parentMenu), clean(item.submenu)]);
                            const permissionRows = perms.length ? perms : [['Sin permisos configurados', '—', '—', '—']]; permissionRows.forEach(row => ws.addRow(row)); styleTable(ws, 10, 10 + permissionRows.length, ['URL API del permiso', 'Descripción', 'Menú padre', 'Submenú']); ws.views = [{ state: 'frozen', ySplit: 10, showGridLines: false }];
                        }
                        if (enabled('response')) {
                            const ws = baseSheet('Server & Store', theme.orange, [32, 32, 32, 32]); titleBlock(ws, 'Server & Store', 'Jerarquía de SiteBuilder y estructura que recibe el Frontend · HU ' + clean(hu.huId), 4);
                            sectionBand(ws, 4, 'SiteBuilder → Frontend · Jerarquía', 4, theme.indigoLight, theme.indigoDark); ws.mergeCells(5, 1, 7, 4); ws.getCell(5, 1).value = clean(hu.storeAction); ws.getCell(5, 1).font = { name: 'Consolas', size: 10, color: { argb: 'FF4338CA' } }; ws.getCell(5, 1).fill = fill('F8FAFC'); ws.getCell(5, 1).alignment = { vertical: 'top', wrapText: true, indent: 1 }; ws.getRow(5).height = 36; ws.getRow(6).height = 28; ws.getRow(7).height = 28;
                            sectionBand(ws, 9, 'Lo que recibe el Frontend · Response Store', 4, theme.greenLight, theme.green); ws.mergeCells(10, 1, 18, 4); ws.getCell(10, 1).value = formatJson(hu.mockResponse); ws.getCell(10, 1).font = { name: 'Consolas', size: 10, color: { argb: 'FF047857' } }; ws.getCell(10, 1).fill = fill('F8FAFC'); ws.getCell(10, 1).alignment = { vertical: 'top', wrapText: true, indent: 1 }; for (let r = 10; r <= 18; r++) ws.getRow(r).height = 25;
                        }

                        const buffer = await wb.xlsx.writeBuffer();
                        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        const link = document.createElement('a'); const url = URL.createObjectURL(blob);
                        link.href = url; link.download = 'HU_' + clean(hu.huId).replace(/[^a-zA-Z0-9_-]/g, '_') + '_' + clean(hu.name).replace(/[^a-zA-Z0-9_-]/g, '_') + '.xlsx';
                        document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
                        this.showToast('Excel descargado con el formato StoreFlow');
                    } catch (error) { await this.showAppNotice('No se pudo generar el archivo Excel: ' + (error.message || 'error inesperado'), { title: 'Error al exportar', kind: 'danger' }); }
                },
                openShareModal() {
                    const c = this.huData;
                    const summary = {
                        id_hu: c.huId,
                        titulo_hu: c.name,
                        referencia_jira: c.collaboration?.jiraCode || '',
                        area_principal: c.collaboration?.area || '',
                        subtareas_colaborativas: c.collaboration?.subtasks || [],
                        metadatos: c.meta,
                        endpoints: c.endpoints,
                        fechas_compromiso: { diseño: c.designDate, qa: c.qaDate },
                        responsables: c.owners,
                        modelo_base_datos: c.dbModel,
                        menu_y_permisos_multiples: c.permissionsList,
                        server_store: { sitebuilder_a_frontend: c.storeAction, frontend_recibe: JSON.parse(c.mockResponse) }
                    };
                    this.shareTextOutput = JSON.stringify(summary, null, 2);
                    this.showShareModal = true;
                },
                async copyShareText() {
                    try { await navigator.clipboard.writeText(this.shareTextOutput); this.showToast('Consolidado copiado al portapapeles'); }
                    catch (_) { this.showAppNotice('El navegador no permitió copiar automáticamente. Selecciona el contenido y cópialo manualmente.', { title: 'No se pudo copiar', kind: 'danger' }); }
                },
                resetData() {
                    localStorage.removeItem('storeflow_hu_single_v22');
                    location.reload();
                }
  })
  return app
}

