<template>
  <div class="min-h-screen flex flex-col antialiased selection:bg-brand-500 selection:text-white" :class="darkMode ? 'dark bg-[#060913] text-slate-100' : 'bg-[#f4f7fc] text-slate-900'">


    <div v-show="!isAuthenticated" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4">
        <div class="w-full max-w-md rounded-3xl border p-7 shadow-2xl" :class="darkMode ? 'bg-[#0b101e] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'">
            <div class="text-center mb-6"><div class="mx-auto mb-3 h-12 w-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center"><i class="fas fa-layer-group text-white"></i></div><h2 class="font-black text-lg">StoreFlow Studio</h2><p class="text-xs opacity-60 mt-1" v-text="authMode === 'login' ? 'Inicia sesión para continuar' : 'Crea tu cuenta del equipo' "></p></div>
            <div class="grid grid-cols-2 gap-2 mb-5 rounded-xl p-1" :class="darkMode ? 'bg-slate-900' : 'bg-slate-100'"><button @click="switchAuthMode('login')" class="rounded-lg py-2 text-xs font-bold" :class="authMode === 'login' ? 'bg-brand-600 text-white' : 'opacity-60'">Iniciar sesión</button><button @click="switchAuthMode('register')" class="rounded-lg py-2 text-xs font-bold" :class="authMode === 'register' ? 'bg-brand-600 text-white' : 'opacity-60'">Registrarme</button></div>
            <form @submit.prevent="submitAuth()" class="space-y-3">
                <input v-show="authMode === 'register'" v-model.trim="authName" type="text" required minlength="2" placeholder="Nombre completo" :disabled="authMode !== 'register'" class="w-full rounded-xl border px-3 py-2.5 text-sm" :class="darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'">
                <label v-show="authMode === 'register'" class="block text-xs font-semibold">Área
                    <select v-model="authArea" required :disabled="authMode !== 'register'" class="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" :class="darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'"><option value="">Selecciona tu área</option><template v-for="area in workAreas" :key="area"><option :value="area" v-text="area"></option></template></select>
                </label>
                <input v-model.trim="authEmail" :type="authMode === 'register' ? 'email' : 'text'" required :autocomplete="authMode === 'register' ? 'email' : 'username'" :placeholder="authMode === 'register' ? 'Correo electrónico' : 'Usuario o correo electrónico'" class="w-full rounded-xl border px-3 py-2.5 text-sm" :class="darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'">
                <p v-show="authMode === 'register'" class="px-1 text-[10px] opacity-50">Validaremos el formato, el dominio del correo y que aún no exista una cuenta con esa dirección.</p>
                <input v-model="authPassword" type="password" required :minlength="authMode === 'register' ? 8 : 1" :autocomplete="authMode === 'register' ? 'new-password' : 'current-password'" placeholder="Contraseña (mínimo 8 caracteres al registrarte)" class="w-full rounded-xl border px-3 py-2.5 text-sm" :class="darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'">
                <p v-show="authError" v-text="authError" class="text-xs text-rose-400" role="alert"></p>
                <button type="submit" class="w-full rounded-xl bg-brand-600 hover:bg-brand-500 py-2.5 text-sm font-bold text-white" v-text="authMode === 'login' ? 'Entrar' : 'Crear cuenta'"></button>
            </form>
            <p class="mt-4 text-[10px] leading-relaxed opacity-50">Las cuentas, HU e historial se comparten mediante el servidor del equipo.</p>
        </div>
    </div>

    <!-- Top Navbar Studio Pro -->
    <header v-show="isAuthenticated && !showDashboard" class="border-b backdrop-blur-2xl sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between shadow-xs"
            :class="darkMode ? 'border-slate-800/80 bg-[#060913]/90' : 'border-slate-200/80 bg-white/90'">
        <div class="flex items-center space-x-3.5">
            <div class="h-9 w-9 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-violet-400 flex items-center justify-center shadow-md shadow-brand-500/25">
                <i class="fas fa-layer-group text-white text-xs"></i>
            </div>
            <div>
                <h1 class="font-black text-sm tracking-tight flex items-center space-x-2">
                    <span class="bg-gradient-to-r from-brand-500 to-violet-500 bg-clip-text text-transparent">StoreFlow Studio</span>
                    <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 font-extrabold border border-brand-500/20">HU Única & Endpoints</span>
                </h1>
                <p class="text-[10px] font-semibold opacity-60">ID HU: <span class="font-mono text-brand-400" v-text="huData.huId"></span> • <span v-text="huData.name"></span></p>
            </div>
        </div>

        <div class="flex items-center space-x-2.5">
            <button @click="toggleDarkMode()" class="px-3 py-1.5 rounded-xl text-xs transition border flex items-center space-x-1.5 font-semibold shadow-xs"
                    :class="darkMode ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'">
                <i class="fas" :class="darkMode ? 'fa-sun text-amber-400' : 'fa-moon text-indigo-600'"></i>
                <span v-text="darkMode ? 'Claro' : 'Oscuro'"></span>
            </button>
            <button @click="exportToExcelReal()" class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition flex items-center space-x-1.5" title="Exporta un Excel formateado y organizado">
                <i class="fas fa-file-excel text-xs"></i>
                <span>Exportar Excel (.xlsx)</span>
            </button>
            <button @click="openShareModal()" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-brand-600/25 transition flex items-center space-x-1.5">
                <i class="fas fa-file-export text-xs"></i>
                <span>Consolidado JSON</span>
            </button>
            <button @click="resetData()" class="px-3 py-1.5 rounded-xl text-xs font-semibold transition border"
                    :class="darkMode ? 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800' : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 shadow-xs'" title="Restaurar demo">Restaurar</button>
            <button v-show="isAuthenticated" @click="logout()" class="px-3 py-1.5 rounded-xl text-xs font-bold border" :class="darkMode ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'"><i class="fas fa-arrow-right-from-bracket mr-1"></i>Cerrar sesión</button>
        </div>
    </header>

    <section v-show="isAuthenticated && !showDashboard" class="px-5 py-3 border-b flex flex-wrap items-center gap-3" :class="darkMode ? 'bg-[#0b101e] border-slate-800' : 'bg-white border-slate-200'">
        <label class="text-xs font-bold opacity-70">Carpeta
            <input type="text" v-model="huData.folder" @input="saveLocal()" placeholder="Ej. Producto / Tours" class="ml-1 rounded-lg border px-2 py-1.5 text-xs" :class="darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'">
        </label>
        <label class="text-xs font-bold opacity-70">Sprint
            <input type="text" v-model="huData.sprint" @input="saveLocal()" placeholder="Ej. Sprint 12" class="ml-1 rounded-lg border px-2 py-1.5 text-xs" :class="darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'">
        </label>
        <label class="text-xs font-bold opacity-70">Editor
            <input type="text" v-model="currentUser" readonly aria-label="Usuario autenticado" title="El editor corresponde a la cuenta conectada" class="ml-1 rounded-lg border px-2 py-1.5 text-xs" :class="darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'">
        </label>
        <button @click="loadHistory()" class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"><i class="fas fa-clock-rotate-left mr-1"></i>Versiones (<span v-text="historyLog.length"></span>)</button>
        <label class="text-xs font-bold opacity-70">Estado <select v-model="huStatus" @change="saveLocal()" class="ml-1 rounded-lg border px-2 py-1.5 text-xs" :class="darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'"><option>Borrador</option><option>En progreso</option><option>En revisión</option><option>Finalizada</option></select></label>
        <div class="ml-auto flex gap-2"><button @click="backToDashboard()" class="px-3 py-1.5 rounded-lg border text-xs font-bold" :class="darkMode ? 'border-slate-700 hover:bg-slate-900' : 'border-slate-200 hover:bg-slate-50'"><i class="fas fa-arrow-left mr-1"></i>Panel</button><button @click="saveCurrentHu()" class="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold"><i class="fas fa-cloud-arrow-up mr-1"></i>Guardar HU</button></div>    </section>

    <section v-show="isAuthenticated && showDashboard" class="flex-1 max-w-[1550px] w-full mx-auto p-5 md:p-8 space-y-6">
        <div class="flex flex-wrap items-end justify-between gap-4"><div><p class="text-[11px] uppercase tracking-[.22em] font-bold text-brand-400">StoreFlow Studio · Workspace</p><h2 class="text-2xl md:text-3xl font-black tracking-tight mt-1">Trabajo colaborativo por HU</h2><p class="text-sm opacity-60 mt-1">Una persona crea la HU y asigna al equipo; cada integrante la verá en su bandeja.</p></div><div class="flex items-center gap-3"><div class="hidden text-right sm:block"><div class="text-xs font-bold" v-text="currentUser"></div><div class="mt-1 text-[10px] opacity-55" v-text="currentUserArea"></div><button @click="showProfileModal=true" class="mt-1 text-[9px] font-bold text-brand-400 hover:text-brand-300">Editar perfil</button></div><button @click="createNewHu()" class="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm font-extrabold shadow-lg shadow-brand-600/20"><i class="fas fa-plus mr-2"></i>Abrir o crear</button><button @click="logout()" class="h-11 w-11 rounded-2xl border text-sm" :class="darkMode ? 'border-slate-800 hover:bg-slate-900' : 'border-slate-200 hover:bg-white'" title="Cerrar sesión"><i class="fas fa-arrow-right-from-bracket"></i></button></div></div>
        <div class="grid grid-cols-2 xl:grid-cols-4 gap-3"><div class="rounded-2xl border p-4" :class="darkMode ? 'bg-[#0b101e] border-slate-800' : 'bg-white border-slate-200'"><div class="text-[10px] uppercase tracking-widest opacity-50">Total de HU</div><div class="text-2xl font-black mt-1" v-text="huList.length"></div></div><div class="rounded-2xl border p-4" :class="darkMode ? 'bg-[#0b101e] border-slate-800' : 'bg-white border-slate-200'"><div class="text-[10px] uppercase tracking-widest opacity-50">En progreso</div><div class="text-2xl font-black mt-1 text-sky-400" v-text="huList.filter(h => h.status === 'En progreso').length"></div></div><div class="rounded-2xl border p-4" :class="darkMode ? 'bg-[#0b101e] border-slate-800' : 'bg-white border-slate-200'"><div class="text-[10px] uppercase tracking-widest opacity-50">En revisión</div><div class="text-2xl font-black mt-1 text-amber-400" v-text="huList.filter(h => h.status === 'En revisión').length"></div></div><div class="rounded-2xl border p-4" :class="darkMode ? 'bg-[#0b101e] border-slate-800' : 'bg-white border-slate-200'"><div class="text-[10px] uppercase tracking-widest opacity-50">Finalizadas</div><div class="text-2xl font-black mt-1 text-emerald-400" v-text="huList.filter(h => h.status === 'Finalizada').length"></div></div></div>
        <div class="rounded-3xl border overflow-hidden shadow-xl" :class="darkMode ? 'bg-[#0b101e] border-slate-800' : 'bg-white border-slate-200'"><div class="p-4 md:p-5 border-b flex flex-wrap gap-3" :class="darkMode ? 'border-slate-800' : 'border-slate-200'"><div class="relative flex-1 min-w-[220px]"><i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-40"></i><input v-model="dashboardSearch" type="search" placeholder="Buscar por ID o nombre..." class="w-full rounded-xl border pl-9 pr-3 py-2.5 text-xs" :class="darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'"></div><select v-model="dashboardFolder" class="rounded-xl border px-3 py-2.5 text-xs" :class="darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'"><option value="">Todas las carpetas</option><template v-for="folder in uniqueFolders" :key="folder"><option :value="folder" v-text="folder"></option></template></select><select v-model="dashboardSprint" class="rounded-xl border px-3 py-2.5 text-xs" :class="darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'"><option value="">Todos los sprints</option><template v-for="sprint in uniqueSprints" :key="sprint"><option :value="sprint" v-text="sprint"></option></template></select><select v-model="dashboardStatus" class="rounded-xl border px-3 py-2.5 text-xs" :class="darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'"><option value="">Todos los estados</option><option>Borrador</option><option>En progreso</option><option>En revisión</option><option>Finalizada</option></select><button @click="loadHus()" class="rounded-xl border px-3 py-2.5 text-xs font-bold" :class="darkMode ? 'border-slate-700 hover:bg-slate-900' : 'border-slate-200 hover:bg-slate-50'"><i class="fas fa-rotate mr-1"></i>Actualizar</button></div>
        <div class="overflow-x-auto"><table class="w-full text-left min-w-[900px]"><thead class="text-[10px] uppercase tracking-wider opacity-50" :class="darkMode ? 'bg-slate-900/60' : 'bg-slate-50'"><tr><th class="px-5 py-3">HU principal</th><th class="px-4 py-3">Área</th><th class="px-4 py-3">Subtareas</th><th class="px-4 py-3">Estado</th><th class="px-4 py-3">Responsable</th><th class="px-4 py-3">Modificada</th><th class="px-4 py-3 text-right">Acciones</th></tr></thead><tbody class="divide-y" :class="darkMode ? 'divide-slate-800' : 'divide-slate-100'"><template v-for="hu in filteredHus" :key="hu.id"><tr class="transition" :class="darkMode ? 'hover:bg-slate-900/60' : 'hover:bg-slate-50'"><td class="px-5 py-4"><button @click="openHu(hu)" class="text-left group"><div class="font-mono text-[10px] text-brand-400" v-text="hu.jira_code || hu.hu_code"></div><div class="font-bold text-sm mt-0.5 group-hover:text-brand-400" v-text="hu.title"></div></button></td><td class="px-4 py-4 text-xs opacity-70" v-text="hu.area || '—'"></td><td class="px-4 py-4 text-xs opacity-70" v-text="hu.subtask_count || 0"></td><td class="px-4 py-4"><span class="rounded-full px-2.5 py-1 text-[10px] font-bold" :class="hu.status === 'Finalizada' ? 'bg-emerald-500/10 text-emerald-400' : hu.status === 'En revisión' ? 'bg-amber-500/10 text-amber-400' : hu.status === 'En progreso' ? 'bg-sky-500/10 text-sky-400' : 'bg-slate-500/10 text-slate-400'" v-text="hu.status"></span></td><td class="px-4 py-4 text-xs" v-text="hu.owner_name"></td><td class="px-4 py-4 text-[10px] opacity-60" v-text="formatDate(hu.updated_at)"></td><td class="px-4 py-4"><div class="flex justify-end gap-1"><button @click="openHu(hu)" class="h-8 w-8 rounded-lg text-brand-400 hover:bg-brand-500/10" title="Abrir"><i class="fas fa-arrow-up-right-from-square text-xs"></i></button><button @click="duplicateHu(hu)" class="h-8 w-8 rounded-lg text-sky-400 hover:bg-sky-500/10" title="Duplicar"><i class="fas fa-copy text-xs"></i></button><button v-show="hu.owner_id === currentUserId" @click="deleteHu(hu)" class="h-8 w-8 rounded-lg text-rose-400 hover:bg-rose-500/10" title="Eliminar"><i class="fas fa-trash text-xs"></i></button></div></td></tr></template></tbody></table></div>
        <div v-show="filteredHus.length === 0" class="py-16 px-5 text-center"><div class="mx-auto h-12 w-12 rounded-2xl flex items-center justify-center bg-brand-500/10 text-brand-400"><i class="fas fa-folder-open"></i></div><h3 class="font-bold mt-3" v-text="huList.length ? 'No encontramos HU con esos filtros' : 'Aún no hay espacios de trabajo'"></h3><p class="text-xs opacity-55 mt-1" v-text="huList.length ? 'Prueba otra búsqueda o limpia los filtros.' : 'Crea un espacio con el código de Jira, el nombre y el área.'"></p><button v-show="huList.length === 0" @click="createNewHu()" class="mt-4 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white"><i class="fas fa-plus mr-1"></i>Crear espacio</button><button v-show="huList.length === 0 && legacyHuData" @click="importLegacyHu()" class="mt-4 ml-2 rounded-xl border px-4 py-2.5 text-xs font-bold" :class="darkMode ? 'border-slate-700 hover:bg-slate-900' : 'border-slate-200 hover:bg-slate-50'"><i class="fas fa-file-import mr-1"></i>Importar HU guardada anteriormente</button></div></div>

    </section>
    <div v-show="showCreateWorkspace" class="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
        <form @submit.prevent="createWorkspace()" class="max-h-[92vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-3xl border p-6 shadow-2xl" :class="darkMode ? 'bg-[#0b101e] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'">
            <div><p class="text-[10px] uppercase tracking-[.2em] font-bold text-brand-400">Nuevo espacio de trabajo</p><h3 class="text-xl font-black mt-1">Configura la HU del equipo</h3><p class="text-xs opacity-60 mt-1">Si el código de Jira ya existe, abrirás el espacio compartido existente.</p></div>
            <div class="grid gap-3 sm:grid-cols-2">
                <label class="block text-xs font-bold">Número de HU en Jira<input v-model.trim="workspaceDraft.jiraCode" required maxlength="32" placeholder="Ej. PROY-123" class="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm font-mono" :class="darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'"></label>
                <label class="block text-xs font-bold">Nombre de la HU<input v-model.trim="workspaceDraft.name" required maxlength="220" placeholder="Ej. Registro de usuarios" class="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" :class="darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'"></label>
                <div class="rounded-xl border px-3 py-2.5 text-xs sm:col-span-2" :class="darkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'"><span class="opacity-55">Área del creador</span><span class="ml-2 font-bold" v-text="workspaceDraft.area || currentUserArea"></span><p class="mt-1 text-[10px] opacity-50">Se toma del perfil registrado. El área de cada integrante también se asigna desde su perfil.</p></div>
                <label class="block text-xs font-bold">Modalidad<select v-model="workspaceDraft.mode" class="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" :class="darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'"><option value="individual">Individual</option><option value="collaborative">Colaborativa</option></select></label>
            </div>
            <section v-show="workspaceDraft.mode === 'collaborative'" class="space-y-3 rounded-2xl border p-4" :class="darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'">
                <div><h4 class="text-xs font-bold">Responsables iniciales</h4><p class="mt-1 text-[10px] opacity-55">Elige integrantes por área. Cada persona asignada verá esta HU en su bandeja al iniciar sesión y podrá continuar el trabajo compartido.</p></div>
                <div class="grid gap-3 sm:grid-cols-2"><template v-for="role in assignmentRoles" :key="role.key"><label class="block text-[11px] font-semibold"><span v-text="role.label"></span><select v-model="workspaceDraft.assignees[role.key]" class="mt-1 w-full rounded-lg border px-2.5 py-2 text-xs" :class="darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-300'"><option value="">Sin asignar</option><template v-for="member in membersForArea(role.area)" :key="member.id"><option :value="member.id" v-text="member.name"></option></template></select><span v-show="!membersForArea(role.area).length" class="mt-1 block text-[9px] opacity-45" v-text="'No hay integrantes registrados en ' + role.area"></span></label></template></div>
            </section>
            <p v-show="workspaceDraft.mode === 'individual'" class="rounded-xl bg-sky-500/10 p-3 text-xs text-sky-200"><i class="fas fa-user mr-1"></i>Se abrirá el editor sin tareas ni responsables compartidos.</p>
            <p v-show="workspaceError" v-text="workspaceError" class="text-xs text-rose-400" role="alert"></p>
            <div class="flex justify-end gap-2 pt-2"><button type="button" @click="showCreateWorkspace=false" class="rounded-xl border px-4 py-2 text-xs font-bold">Cancelar</button><button type="submit" :disabled="workspaceSaving || teamLoading" class="rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50" v-text="teamLoading ? 'Cargando equipo…' : (workspaceSaving ? 'Buscando…' : 'Abrir o crear espacio')"></button></div>
        </form>
    </div>
    <div v-show="showProfileModal" class="fixed inset-0 z-[115] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4" @click.self="showProfileModal=false">
        <form @submit.prevent="saveMyArea()" class="w-full max-w-md space-y-4 rounded-3xl border p-6 shadow-2xl" :class="darkMode ? 'bg-[#0b101e] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'"><div><p class="text-[10px] uppercase tracking-[.2em] font-bold text-brand-400">Perfil de equipo</p><h3 class="mt-1 text-xl font-black">Tu área de trabajo</h3><p class="mt-1 text-xs opacity-60">Se usará para mostrarte en las asignaciones de HU.</p></div><label class="block text-xs font-bold">Área<select v-model="currentUserArea" required class="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" :class="darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'"><option value="">Selecciona tu área</option><template v-for="area in workAreas" :key="area"><option :value="area" v-text="area"></option></template></select></label><div class="flex justify-end gap-2"><button type="button" @click="showProfileModal=false" class="rounded-xl border px-4 py-2 text-xs font-bold">Cancelar</button><button class="rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white">Guardar perfil</button></div></form>
    </div>
    <div v-show="showMeetingMode" class="fixed inset-0 z-[130] overflow-y-auto bg-slate-950/90 backdrop-blur-md p-3 md:p-8">
        <div class="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-5xl flex-col overflow-hidden rounded-3xl border shadow-2xl md:min-h-[calc(100vh-4rem)]" :class="darkMode ? 'bg-[#0b101e] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'">
            <header class="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 md:px-8" :class="darkMode ? 'border-slate-800' : 'border-slate-200'">
                <div><p class="text-[10px] font-bold uppercase tracking-[.2em] text-violet-400">StoreFlow · Sesión colaborativa</p><h2 class="mt-1 text-lg font-black" v-text="(huData.collaboration?.jiraCode || huData.huId || 'HU') + ' · ' + huData.name"></h2><p class="mt-1 text-[10px] opacity-50">Los cambios se guardan en el espacio compartido.</p></div>
                <button @click="showMeetingMode=false" class="rounded-xl border px-3 py-2 text-xs font-bold" :class="darkMode ? 'border-slate-700 hover:bg-slate-900' : 'border-slate-200 hover:bg-slate-50'"><i class="fas fa-times mr-1"></i>Salir del modo reunión</button>
            </header>
            <nav class="grid grid-cols-1 gap-2 border-b p-3 sm:grid-cols-3 md:px-8" :class="darkMode ? 'border-slate-800' : 'border-slate-200'">
                <template v-for="(step, idx) in meetingSteps" :key="step"><button @click="meetingStep=idx" class="rounded-xl px-3 py-2 text-left text-xs font-bold" :class="meetingStep === idx ? 'bg-violet-600 text-white' : (darkMode ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900')"><span class="mr-2 opacity-70" v-text="'0' + (idx + 1)"></span><span v-text="step"></span></button></template>
            </nav>
            <main class="flex-1 overflow-y-auto p-5 md:p-8">
                <div class="mx-auto max-w-3xl rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4 text-xs text-sky-200"><i class="fas fa-link mr-2"></i>La HU y sus criterios de aceptación se consultan en Jira. Aquí el equipo organiza responsables, subtareas, acuerdos y dudas de la reunión.</div>
                <section v-show="meetingStep === 0" class="mx-auto max-w-3xl space-y-5">
                    <div><p class="text-xs font-bold uppercase tracking-wider text-violet-400">1 · Repartir</p><h3 class="mt-1 text-2xl font-black">¿Quién se encarga de cada parte?</h3><p class="mt-1 text-sm opacity-60">Dividan el trabajo por área y responsable. Cada tarea queda vinculada a esta HU.</p></div>
                    <form @submit.prevent="addSubtask()" class="grid gap-2 rounded-2xl border p-4 md:grid-cols-[1fr_1fr_auto]" :class="darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'"><input v-model.trim="subtaskDraft.title" required placeholder="Parte del trabajo" class="rounded-xl border px-3 py-2 text-xs" :class="darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-300'"><select v-model="subtaskDraft.ownerId" required class="rounded-xl border px-3 py-2 text-xs" :class="darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-300'"><option value="">Asignar a integrante</option><template v-for="member in teamMembers" :key="member.id"><option :value="member.id" v-text="member.name + ' · ' + member.area"></option></template></select><button class="rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white">Agregar tarea</button></form>
                    <div class="space-y-2"><template v-for="(task, idx) in huData.collaboration.subtasks" :key="task.id"><div class="grid gap-2 rounded-xl border p-3 md:grid-cols-[1fr_120px_160px] md:items-center" :class="darkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white'"><div><p class="text-sm font-bold" v-text="task.title"></p><p class="mt-1 text-[10px] opacity-50" v-text="(task.area || 'Sin área') + ' · responsable: ' + (task.owner || 'pendiente')"></p></div><select v-model="task.status" @change="saveSubtask(task)" class="rounded-lg border px-2 py-2 text-xs" :class="darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-300'"><option>Pendiente</option><option>En progreso</option><option>Bloqueada</option><option>Terminada</option></select><span class="text-[10px] opacity-50" v-text="'Último cambio: ' + (task.updatedBy || '—')"></span></div></template><p v-show="!huData.collaboration.subtasks.length" class="rounded-2xl border border-dashed p-8 text-center text-sm opacity-50" :class="darkMode ? 'border-slate-700' : 'border-slate-300'">Todavía no hay tareas. Pueden agregarlas durante la reunión.</p></div>
                </section>
                <section v-show="meetingStep === 1" class="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
                    <div class="rounded-2xl border p-5" :class="darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'"><p class="text-xs font-bold uppercase tracking-wider text-emerald-400">Acuerdos</p><p class="mt-1 text-[10px] opacity-50">Decisiones que el equipo ya confirmó.</p><form @submit.prevent="addMeetingItem('decisions')" class="mt-3 flex gap-2"><input v-model.trim="meetingDrafts.decision" placeholder="Escribir un acuerdo…" class="min-w-0 flex-1 rounded-xl border px-3 py-2 text-xs" :class="darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-300'"><button class="rounded-xl bg-emerald-600 px-3 text-xs font-bold text-white"><i class="fas fa-plus"></i></button></form><ul class="mt-3 space-y-2"><template v-for="(item, idx) in huData.meeting.decisions" :key="item.id"><li class="flex items-start gap-2 rounded-xl border p-3 text-xs" :class="darkMode ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-white'"><i class="fas fa-check text-emerald-400"></i><div class="min-w-0 flex-1"><p v-text="item.text"></p><p class="mt-1 text-[10px] opacity-45" v-text="item.author + ' · ' + formatDate(item.createdAt)"></p></div><button @click="removeMeetingItem('decisions', idx)" class="text-rose-400"><i class="fas fa-times"></i></button></li></template><li v-show="!huData.meeting.decisions.length" class="py-4 text-center text-xs opacity-45">Sin acuerdos registrados.</li></ul></div>
                    <div class="rounded-2xl border p-5" :class="darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'"><p class="text-xs font-bold uppercase tracking-wider text-amber-400">Preguntas pendientes</p><p class="mt-1 text-[10px] opacity-50">Dudas que necesitan respuesta; no se convierten en requisitos.</p><form @submit.prevent="addMeetingItem('openQuestions')" class="mt-3 flex gap-2"><input v-model.trim="meetingDrafts.question" placeholder="¿Qué falta aclarar?" class="min-w-0 flex-1 rounded-xl border px-3 py-2 text-xs" :class="darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-300'"><button class="rounded-xl bg-amber-600 px-3 text-xs font-bold text-white"><i class="fas fa-plus"></i></button></form><ul class="mt-3 space-y-2"><template v-for="(item, idx) in huData.meeting.openQuestions" :key="item.id"><li class="flex items-start gap-2 rounded-xl border p-3 text-xs" :class="darkMode ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-white'"><i class="fas fa-circle-question text-amber-400"></i><div class="min-w-0 flex-1"><p v-text="item.text"></p><p class="mt-1 text-[10px] opacity-45" v-text="item.author + ' · ' + formatDate(item.createdAt)"></p></div><button @click="removeMeetingItem('openQuestions', idx)" class="text-rose-400"><i class="fas fa-times"></i></button></li></template><li v-show="!huData.meeting.openQuestions.length" class="py-4 text-center text-xs opacity-45">No hay preguntas pendientes.</li></ul></div>
                </section>
                <section v-show="meetingStep === 2" class="mx-auto max-w-3xl space-y-5">
                    <div><p class="text-xs font-bold uppercase tracking-wider text-violet-400">3 · Cerrar</p><h3 class="mt-1 text-2xl font-black">Resumen de la sesión</h3><p class="mt-1 text-sm opacity-60">Revisen qué acordaron y qué queda pendiente antes de volver al editor.</p></div>
                    <div class="grid gap-3 sm:grid-cols-3"><div class="rounded-2xl border p-4" :class="darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'"><p class="text-[10px] uppercase opacity-50">Acuerdos</p><p class="mt-1 text-xl font-black" v-text="huData.meeting.decisions.length"></p></div><div class="rounded-2xl border p-4" :class="darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'"><p class="text-[10px] uppercase opacity-50">Subtareas</p><p class="mt-1 text-xl font-black" v-text="huData.collaboration.subtasks.length"></p></div><div class="rounded-2xl border p-4" :class="darkMode ? 'border-slate-800 bg-slate-900/50' : 'bg-white border-slate-200'"><p class="text-[10px] uppercase opacity-50">Por aclarar</p><p class="mt-1 text-xl font-black text-amber-400" v-text="huData.meeting.openQuestions.length"></p></div></div>
                    <div class="space-y-3 rounded-2xl border p-5" :class="darkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white'"><div><h4 class="text-xs font-bold">HU de referencia</h4><p class="mt-1 whitespace-pre-line text-sm opacity-70" v-text="(huData.collaboration.jiraCode || huData.huId || 'HU') + ' · ' + huData.name"></p><p class="mt-1 text-xs opacity-50">El alcance y los criterios se consultan en Jira.</p></div><div><h4 class="text-xs font-bold">Acuerdos</h4><p class="mt-1 text-sm opacity-70" v-text="huData.meeting.decisions.length ? huData.meeting.decisions.map(item => item.text).join(' · ') : 'Aún no hay acuerdos registrados.'"></p></div><div><h4 class="text-xs font-bold">Preguntas abiertas</h4><p class="mt-1 text-sm opacity-70" v-text="huData.meeting.openQuestions.length ? huData.meeting.openQuestions.map(item => item.text).join(' · ') : 'Ninguna' "></p></div></div>
                    <div class="overflow-hidden rounded-2xl border" :class="darkMode ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'"><div class="flex items-center justify-between border-b px-4 py-3" :class="darkMode ? 'border-slate-800' : 'border-slate-200'"><h4 class="text-xs font-bold">Documento de acuerdos</h4><button @click="copyMeetingSummary()" class="rounded-lg bg-violet-600 px-3 py-1.5 text-[10px] font-bold text-white"><i class="fas fa-copy mr-1"></i>Copiar</button></div><pre class="max-h-64 overflow-auto whitespace-pre-wrap p-4 text-[11px] leading-relaxed opacity-75" v-text="meetingSummaryText()"></pre></div>
                    <p class="rounded-xl bg-sky-500/10 p-3 text-xs text-sky-300"><i class="fas fa-circle-info mr-1"></i>El cierre guarda un resumen de la sesión; no cambia el estado de la HU ni resuelve automáticamente lo pendiente.</p>
                </section>
            </main>
            <footer class="flex items-center justify-between gap-3 border-t px-5 py-4 md:px-8" :class="darkMode ? 'border-slate-800' : 'border-slate-200'"><button v-show="meetingStep > 0" @click="meetingStep--" class="rounded-xl border px-4 py-2 text-xs font-bold" :class="darkMode ? 'border-slate-700 hover:bg-slate-900' : 'border-slate-200 hover:bg-slate-50'"><i class="fas fa-arrow-left mr-1"></i>Anterior</button><span v-show="meetingStep === 0"></span><span class="text-[10px] opacity-50" v-text="'Paso ' + (meetingStep + 1) + ' de 3 · guardado automático'"></span><button v-show="meetingStep < 2" @click="meetingStep++" class="rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white">Siguiente<i class="fas fa-arrow-right ml-1"></i></button><button v-show="meetingStep === 2" @click="finishMeeting()" class="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white"><i class="fas fa-check mr-1"></i>Guardar resumen y cerrar</button></footer>
        </div>
    </div>

    <!-- Layout Maestro: Sidebar Izquierdo (Endpoints de la HU) + Workspace Derecho (Secciones) -->
    <main v-show="isAuthenticated && !showDashboard" class="flex-1 max-w-[1650px] w-full mx-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-70px)] overflow-hidden">

        <!-- Panel Izquierdo: Lista de Endpoints que forman parte de la HU -->
        <div class="lg:col-span-3 border rounded-3xl p-4 flex flex-col shadow-xl h-full overflow-hidden backdrop-blur-md"
             :class="darkMode ? 'bg-[#0b101e]/80 border-slate-800/80' : 'bg-white border-slate-200/90'">
            <div class="flex items-center justify-between mb-3 px-1">
                <h2 class="text-xs font-black uppercase tracking-wider opacity-60 flex items-center space-x-1.5">
                    <i class="fas fa-network-wired text-brand-500"></i>
                    <span>Endpoints de la HU</span>
                </h2>
                <button @click="addEndpoint()" class="text-[10px] font-bold bg-brand-600 hover:bg-brand-500 text-white px-2.5 py-1 rounded-lg shadow-xs flex items-center space-x-1">
                    <i class="fas fa-plus text-[9px]"></i>
                    <span>Agregar</span>
                </button>
            </div>

            <!-- Buscador Rápido -->
            <div class="relative mb-3">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><i class="fas fa-search text-xs"></i></span>
                <input type="text" v-model="searchQuery" placeholder="Buscar endpoint..." class="w-full pl-9 pr-3 py-2 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-brand-500/40 font-medium"
                       :class="darkMode ? 'bg-[#060913] border-slate-800 text-slate-200 placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'">
            </div>

            <!-- Lista de Endpoints -->
            <div class="flex-1 overflow-y-auto space-y-2 pr-1">
                <template v-for="(ep, index) in filteredEndpoints" :key="index">
                    <div @click="selectEndpoint(ep)" 
                         class="p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between group relative overflow-hidden shadow-2xs"
                         :class="isCurrentEndpoint(ep) 
                            ? (darkMode ? 'bg-gradient-to-r from-brand-600/20 to-indigo-600/20 border-brand-500 text-white font-bold' : 'bg-gradient-to-r from-brand-50 to-indigo-50 border-brand-400 text-brand-950 font-bold') 
                            : (darkMode ? 'bg-[#060913]/50 border-slate-800/70 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200' : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100')">
                        
                        <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-500 transition-opacity" :class="isCurrentEndpoint(ep) ? 'opacity-100' : 'opacity-0'"></div>

                        <div class="truncate pl-1 space-y-1">
                            <div class="flex items-center space-x-2">
                                <span class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider"
                                      :class="ep.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'"
                                      v-text="ep.method"></span>
                                <span class="text-xs truncate font-mono font-bold" v-text="ep.name"></span>
                            </div>
                            <p class="text-[10px] font-mono opacity-60 truncate" v-text="ep.route"></p>
                        </div>
                        <button v-show="huData.endpoints.length > 1" @click.stop="removeEndpoint(ep)" class="opacity-0 group-hover:opacity-100 hover:text-rose-500 transition p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400" title="Eliminar endpoint">
                            <i class="fas fa-trash text-xs"></i>
                        </button>
                    </div>
                </template>
            </div>
        </div>

        <!-- Panel Derecho: Workspace con Pestañas Superiores Estilo "Capsule Studio" -->
        <div class="lg:col-span-9 border rounded-3xl p-6 flex flex-col shadow-2xl h-full overflow-hidden backdrop-blur-xl"
             :class="darkMode ? 'bg-[#0b101e]/80 border-slate-800/80 text-slate-100' : 'bg-white border-slate-200/90 text-slate-900'">
            
            <div class="flex flex-col h-full space-y-5">
                
                <!-- Cabecera de la HU -->
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b" :class="darkMode ? 'border-slate-800' : 'border-slate-200'">
                    <div class="space-y-1 flex-1 min-w-0">
                        <div class="flex items-center space-x-3">
                            <input type="text" v-model="huData.name" @input="saveLocal()" class="text-base font-black bg-transparent border-b-2 border-dashed focus:outline-none w-full tracking-tight" :class="darkMode ? 'border-slate-700 text-slate-100 focus:border-brand-500' : 'border-slate-300 text-slate-900 focus:border-brand-600'">
                        </div>
                        <div class="flex items-center space-x-3 text-xs font-semibold pl-1" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">
                            <span>ID HU: <input type="text" v-model="huData.huId" @input="saveLocal()" class="border rounded-lg px-2 py-0.5 w-16 font-mono text-xs font-bold text-center" :class="darkMode ? 'bg-[#060913] border-slate-800 text-indigo-300' : 'bg-slate-50 border-slate-300 text-indigo-600'"></span>
                            <span class="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20" v-text="currentEndpoint.method + ' ' + currentEndpoint.route"></span>
                        </div>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2" :class="darkMode ? 'bg-[#060913]/70 border-slate-800' : 'bg-slate-50 border-slate-200'">
                    <span class="mr-1 text-[10px] font-extrabold uppercase tracking-wider opacity-50">Secciones:</span>
                    <template v-for="section in sectionOptions" :key="section.id">
                        <label class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-bold transition" :class="isSectionEnabled(section.id) ? 'border-brand-500/40 bg-brand-500/10 text-brand-300' : (darkMode ? 'border-slate-800 text-slate-500 hover:text-slate-300' : 'border-slate-200 text-slate-500 hover:text-slate-700')">
                            <input type="checkbox" class="accent-indigo-500" :checked="isSectionEnabled(section.id)" @change="setSectionEnabled(section.id, $event.target.checked)" :aria-label="'Mostrar sección ' + section.label">
                            <i class="fas" :class="section.icon"></i><span v-text="section.label"></span>
                        </label>
                    </template>
                </div>

                <!-- Barra de Pestañas Superiores (Capsule Tabs) -->
                <div class="flex flex-wrap items-center p-1.5 rounded-2xl border gap-1 shadow-inner shrink-0"
                     :class="darkMode ? 'bg-[#060913] border-slate-800' : 'bg-slate-100 border-slate-200'">
                    <button @click="activeTab = 'general'" 
                            class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 shrink-0"
                            :class="activeTab === 'general' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' : (darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-white/70')">
                        <i class="fas fa-info-circle text-[11px]"></i>
                        <span>1. Info & Equipo</span>
                    </button>
                    <button v-show="isSectionEnabled('params')" @click="activeTab = 'params'" 
                            class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 shrink-0"
                            :class="activeTab === 'params' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' : (darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-white/70')">
                        <i class="fas fa-network-wired text-[11px]"></i>
                        <span>2. Endpoint Activo & Parámetros</span>
                    </button>
                    <button v-show="isSectionEnabled('db')" @click="activeTab = 'db'" 
                            class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 shrink-0"
                            :class="activeTab === 'db' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' : (darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-white/70')">
                        <i class="fas fa-database text-[11px]"></i>
                        <span>3. Modelo DB</span>
                    </button>
                    <button v-show="isSectionEnabled('menuPermisos')" @click="activeTab = 'menuPermisos'" 
                            class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 shrink-0"
                            :class="activeTab === 'menuPermisos' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' : (darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-white/70')">
                        <i class="fas fa-shield-alt text-[11px]"></i>
                        <span>4. Menú & Permisos Múltiples</span>
                    </button>
                    <button v-show="isSectionEnabled('response')" @click="activeTab = 'response'" 
                            class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 shrink-0"
                            :class="activeTab === 'response' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' : (darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-white/70')">
                        <i class="fas fa-server text-[11px]"></i>
                        <span>5. Server & Store</span>
                    </button>
                </div>

                <!-- Pestaña 1: Info & Equipo -->
                <div v-show="activeTab === 'general'" class="space-y-4 flex-1 overflow-y-auto pr-1">
                    <div v-show="huData.collaboration?.mode !== 'individual'" class="p-4 rounded-2xl border space-y-3" :class="darkMode ? 'bg-[#060913]/60 border-slate-800' : 'bg-slate-50 border-slate-200'">
                        <div class="flex flex-wrap items-center justify-between gap-2"><div><h3 class="text-xs font-black uppercase tracking-wider text-brand-400"><i class="fas fa-people-arrows-left-right mr-1"></i>Trabajo del equipo</h3><p class="text-[10px] opacity-60 mt-1"><span v-text="huData.collaboration?.jiraCode || huData.huId || 'HU sin código'"></span> · <span v-text="huData.collaboration?.area || 'Área pendiente'"></span> · Cambios sincronizados automáticamente</p></div><div class="flex items-center gap-2"><button @click="openMeetingMode()" type="button" class="rounded-lg bg-violet-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-violet-500"><i class="fas fa-people-group mr-1"></i>Modo reunión</button><span class="text-[10px] opacity-50" v-text="collabNotice || (unsavedChanges ? 'Guardando…' : 'Al día')"></span><button v-show="collabConflict" @click="reloadSharedChanges()" type="button" class="rounded-lg bg-amber-500/15 px-2 py-1 text-[10px] font-bold text-amber-400">Recargar cambios del equipo</button></div></div>
                        <form @submit.prevent="addSubtask()" class="grid grid-cols-1 md:grid-cols-4 gap-2">
                            <input v-model.trim="subtaskDraft.title" required placeholder="Subtarea o parte del desarrollo" class="md:col-span-2 rounded-lg border px-3 py-2 text-xs" :class="darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'">
                            <select v-model="subtaskDraft.ownerId" required class="rounded-lg border px-3 py-2 text-xs" :class="darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'"><option value="">Asignar a integrante</option><template v-for="member in teamMembers" :key="member.id"><option :value="member.id" v-text="member.name + ' · ' + member.area"></option></template></select>
                            <button type="submit" class="rounded-lg bg-brand-600 px-3 py-2 text-xs font-bold text-white"><i class="fas fa-plus"></i></button>
                        </form>
                        <div class="space-y-2">
                            <template v-for="(task, taskIndex) in (huData.collaboration?.subtasks || [])" :key="task.id">
                                <div class="grid grid-cols-1 md:grid-cols-[minmax(180px,1fr)_120px_150px_120px_110px_32px] gap-2 items-center rounded-xl border p-2" :class="darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'">
                                    <input v-model="task.title" @input="saveSubtask(task)" class="w-full bg-transparent text-xs font-semibold outline-none" aria-label="Nombre de subtarea">
                                    <select :value="task.ownerId || ''" @change="assignSubtaskMember(task, $event.target.value)" class="min-w-0 rounded-lg border px-2 py-1.5 text-[10px]" :class="darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-300'" aria-label="Responsable de subtarea"><option value="">Sin asignar</option><template v-for="member in teamMembers" :key="member.id"><option :value="member.id" v-text="member.name + ' · ' + member.area"></option></template></select>
                                    <select v-model="task.status" @change="saveSubtask(task)" class="rounded-lg border px-2 py-1.5 text-[10px]" :class="darkMode ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-300'"><option>Pendiente</option><option>En progreso</option><option>Bloqueada</option><option>Terminada</option></select>
                                    <span class="text-[10px] opacity-50" v-text="task.updatedBy ? 'Editó ' + task.updatedBy : ''"></span>
                                    <button type="button" @click="removeSubtask(taskIndex)" class="h-8 rounded-lg text-rose-400 hover:bg-rose-500/10" title="Eliminar subtarea"><i class="fas fa-trash text-[10px]"></i></button>
                                </div>
                            </template>
                            <p v-show="!(huData.collaboration?.subtasks || []).length" class="rounded-xl border border-dashed p-4 text-center text-[10px] opacity-50" :class="darkMode ? 'border-slate-700' : 'border-slate-300'">Agrega las partes del trabajo y asígnalas por área y responsable.</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-4 rounded-2xl border space-y-3 shadow-2xs" :class="darkMode ? 'bg-[#060913]/60 border-slate-800' : 'bg-slate-50 border-slate-200'">
                            <span class="text-[10px] font-black uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5"><i class="fas fa-pen-nib"></i><span>Diseño y Documentación</span></span>
                            <div>
                                <span class="text-[10px] opacity-70 block mb-1 font-semibold">Diseñador:</span>
                                <input type="text" v-model="huData.meta.designer" @input="saveLocal()" class="w-full border rounded-xl px-3 py-2 text-xs font-medium" :class="darkMode ? 'bg-[#060913] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'">
                            </div>
                            <div>
                                <span class="text-[10px] opacity-70 block mb-1 font-semibold">Documentador:</span>
                                <input type="text" v-model="huData.meta.documenter" @input="saveLocal()" class="w-full border rounded-xl px-3 py-2 text-xs font-medium" :class="darkMode ? 'bg-[#060913] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'">
                            </div>
                        </div>
                        <div class="p-4 rounded-2xl border space-y-3 shadow-2xs" :class="darkMode ? 'bg-[#060913]/60 border-slate-800' : 'bg-slate-50 border-slate-200'">
                            <span class="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5"><i class="fas fa-shield-alt"></i><span>Backoffice y QA</span></span>
                            <div>
                                <span class="text-[10px] opacity-70 block mb-1 font-semibold">Analista de Calidad:</span>
                                <input type="text" v-model="huData.meta.qa" @input="saveLocal()" class="w-full border rounded-xl px-3 py-2 text-xs font-medium" :class="darkMode ? 'bg-[#060913] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'">
                            </div>
                            <div>
                                <span class="text-[10px] opacity-70 block mb-1 font-semibold">Login Backoffice / QA:</span>
                                <input type="text" v-model="huData.meta.qaEmail" @input="saveLocal()" class="w-full border rounded-xl px-3 py-2 text-xs font-medium" :class="darkMode ? 'bg-[#060913] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'">
                            </div>
                        </div>
                    </div>

                    <!-- Desarrolladores y Ruta SiteBuilder -->
                    <div class="p-4 rounded-2xl border space-y-3 shadow-2xs" :class="darkMode ? 'bg-[#060913]/60 border-slate-800' : 'bg-slate-50 border-slate-200'">
                        <span class="text-[10px] font-black uppercase tracking-wider text-blue-400 flex items-center space-x-1.5"><i class="fas fa-code-branch"></i><span>Desarrolladores y Ruta de Desarrollo (SiteBuilder)</span></span>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <span class="text-[10px] text-blue-400 block font-bold mb-1">Backend:</span>
                                <input type="text" v-model="huData.meta.backendDev" @input="saveLocal()" class="w-full border rounded-xl px-3 py-2 text-xs font-semibold" :class="darkMode ? 'bg-[#060913] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'">
                            </div>
                            <div>
                                <span class="text-[10px] text-indigo-400 block font-bold mb-1">Frontend:</span>
                                <input type="text" v-model="huData.meta.frontendDev" @input="saveLocal()" class="w-full border rounded-xl px-3 py-2 text-xs font-semibold" :class="darkMode ? 'bg-[#060913] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'">
                            </div>
                            <div>
                                <span class="text-[10px] text-emerald-400 block font-bold mb-1">SiteBuilder / Ruta:</span>
                                <input type="text" v-model="huData.meta.siteBuilderRoute" @input="saveLocal()" class="w-full border rounded-xl px-3 py-2 text-xs font-mono font-semibold" :class="darkMode ? 'bg-[#060913] border-slate-800 text-emerald-300' : 'bg-white border-slate-300 text-emerald-700'">
                            </div>
                        </div>
                    </div>

                    <!-- Fechas y Áreas -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-4 rounded-2xl border space-y-3 shadow-2xs" :class="darkMode ? 'bg-[#060913]/60 border-slate-800' : 'bg-slate-50 border-slate-200'">
                            <span class="text-[10px] font-black uppercase tracking-wider text-purple-400 flex items-center space-x-1.5"><i class="fas fa-calendar-alt"></i><span>Fechas Compromiso</span></span>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <span class="text-[10px] opacity-70 block mb-1 font-semibold">Diseño:</span>
                                    <input type="date" v-model="huData.designDate" @change="saveLocal()" class="w-full border rounded-xl px-2.5 py-2 text-xs" :class="darkMode ? 'bg-[#060913] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'">
                                </div>
                                <div>
                                    <span class="text-[10px] opacity-70 block mb-1 font-semibold">QA:</span>
                                    <input type="date" v-model="huData.qaDate" @change="saveLocal()" class="w-full border rounded-xl px-2.5 py-2 text-xs" :class="darkMode ? 'bg-[#060913] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'">
                                </div>
                            </div>
                        </div>
                        <div class="p-4 rounded-2xl border space-y-3 shadow-2xs" :class="darkMode ? 'bg-[#060913]/60 border-slate-800' : 'bg-slate-50 border-slate-200'">
                            <span class="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center space-x-1.5"><i class="fas fa-users"></i><span>Áreas Involucradas</span></span>
                            <div class="flex flex-wrap gap-2 pt-1">
                                <template v-for="possibleArea in ['Frontend', 'Backend', 'Core', 'QA', 'Sitebuilder']">
                                    <button @click="toggleArea(possibleArea)" 
                                            class="px-3 py-1 rounded-xl text-xs font-bold border transition shadow-2xs"
                                            :class="hasArea(possibleArea) 
                                                ? 'bg-brand-600/20 border-brand-500 text-brand-400' 
                                                : (darkMode ? 'bg-[#060913] border-slate-800 text-slate-500' : 'bg-white border-slate-300 text-slate-500')"
                                            v-text="possibleArea">
                                    </button>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pestaña 2: Endpoint Activo & Parámetros -->
                <div v-show="activeTab === 'params'" class="flex-1 flex flex-col space-y-3 overflow-hidden">
                    <div class="p-4 rounded-2xl border flex items-center justify-between shrink-0 shadow-2xs" :class="darkMode ? 'bg-[#060913]/60 border-slate-800' : 'bg-slate-50 border-slate-200'">
                        <div class="flex items-center space-x-3 w-full">
                            <select v-model="currentEndpoint.method" @change="saveLocal()" class="bg-transparent text-xs font-black focus:outline-none cursor-pointer px-2 py-1 rounded-lg border" :class="currentEndpoint.method === 'GET' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-blue-400 border-blue-500/30 bg-blue-500/10'">
                                <option value="POST" class="bg-slate-900 text-blue-400">POST</option>
                                <option value="GET" class="bg-slate-900 text-emerald-400">GET</option>
                                <option value="PUT" class="bg-slate-900 text-amber-400">PUT</option>
                                <option value="DELETE" class="bg-slate-900 text-rose-400">DELETE</option>
                            </select>
                            <input type="text" v-model="currentEndpoint.name" @input="saveLocal()" class="border-b border-dashed bg-transparent text-xs font-mono font-bold w-36 pb-0.5">
                            <input type="text" v-model="currentEndpoint.route" @input="saveLocal()" class="w-1/2 border rounded-xl px-3 py-1.5 text-xs font-mono text-indigo-400 font-bold" :class="darkMode ? 'bg-[#060913] border-slate-800' : 'bg-white border-slate-300'" placeholder="/api/v1/...">
                        </div>
                    </div>

                    <!-- Tabla de Variables -->
                    <div class="flex-1 flex flex-col space-y-2.5 overflow-hidden">
                        <div class="flex justify-between items-center px-1">
                            <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">Parámetros del Endpoint Seleccionado</h3>
                            <div class="flex space-x-2">
                                <button @click="showJsonModal = true" class="text-xs px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 font-bold shadow-2xs" :class="darkMode ? 'bg-slate-900 hover:bg-slate-800 text-indigo-300 border-slate-800' : 'bg-white hover:bg-slate-100 text-indigo-600 border-slate-300'">
                                    <i class="fas fa-code text-[10px]"></i>
                                    <span>Pegar TS / JSON Tipado</span>
                                </button>
                                <button @click="addParam()" class="text-xs bg-brand-600 hover:bg-brand-500 text-white px-3 py-1.5 rounded-xl font-bold shadow-xs flex items-center space-x-1.5">
                                    <i class="fas fa-plus text-[10px]"></i>
                                    <span>Variable</span>
                                </button>
                            </div>
                        </div>

                        <div class="border rounded-2xl overflow-hidden flex-1 overflow-y-auto shadow-2xs" :class="darkMode ? 'border-slate-800 bg-[#060913]/40' : 'border-slate-200 bg-white'">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="border-b text-[11px] font-black uppercase tracking-wider sticky top-0" :class="darkMode ? 'border-slate-800 bg-[#0b101e] text-slate-400' : 'border-slate-200 bg-slate-100 text-slate-600'">
                                        <th class="p-3">Variable</th>
                                        <th class="p-3 w-36">Tipo</th>
                                        <th class="p-3 w-24 text-center">Obligatorio</th>
                                        <th class="p-3">Descripción</th>
                                        <th class="p-3 text-right w-20">Acción</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y text-xs font-medium" :class="darkMode ? 'divide-slate-800/50' : 'divide-slate-200'">
                                    <template v-for="(param, pIdx) in currentEndpoint.params" :key="pIdx">
                                        <tr>
                                            <td class="p-2.5 font-mono text-emerald-400 font-bold">
                                                <input type="text" v-model="param.name" @input="saveLocal()" class="border rounded-xl px-2.5 py-1.5 w-full text-xs font-mono font-bold" :class="darkMode ? 'bg-[#060913] border-slate-800 text-emerald-300' : 'bg-white border-slate-300 text-emerald-700'">
                                            </td>
                                            <td class="p-2.5">
                                                <select v-model="param.type" @change="saveLocal()" class="border rounded-xl px-2.5 py-1.5 text-xs text-indigo-400 font-bold w-full" :class="darkMode ? 'bg-[#060913] border-slate-800' : 'bg-white border-slate-300'">
                                                    <option value="string">string</option>
                                                    <option value="integer">integer</option>
                                                    <option value="boolean">boolean</option>
                                                    <option value="object">object</option>
                                                    <option value="array">array</option>
                                                </select>
                                            </td>
                                            <td class="p-2.5 text-center">
                                                <input type="checkbox" v-model="param.required" @change="saveLocal()" class="rounded text-brand-600 focus:ring-brand-500 h-4 w-4 cursor-pointer" :class="darkMode ? 'bg-[#060913] border-slate-700' : 'bg-white border-slate-300'">
                                            </td>
                                            <td class="p-2.5">
                                                <input type="text" v-model="param.description" @input="saveLocal()" class="border rounded-xl px-2.5 py-1.5 w-full text-xs font-medium" :class="darkMode ? 'bg-[#060913] border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-800'">
                                            </td>
                                            <td class="p-2.5 text-right">
                                                <button @click="removeParam(pIdx)" class="hover:text-rose-500 transition p-1" :class="darkMode ? 'text-slate-600' : 'text-slate-400'" title="Eliminar variable">
                                                    <i class="fas fa-trash text-xs"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Pestaña 3: Modelo DB -->
                <div v-show="activeTab === 'db'" class="flex-1 flex flex-col space-y-4 overflow-hidden">
                    <div class="flex justify-between items-center px-1">
                        <div>
                            <h3 class="text-xs font-black uppercase tracking-wider text-indigo-400"><i class="fas fa-database mr-1.5"></i>Modelo de Base de Datos</h3>
                            <p class="text-[11px] text-slate-400 font-medium">Tablas y columnas modificadas o creadas para esta HU.</p>
                        </div>
                        <button @click="addDbField()" class="text-xs bg-brand-600 hover:bg-brand-500 text-white px-3.5 py-1.5 rounded-xl font-bold shadow-xs flex items-center space-x-1.5">
                            <i class="fas fa-plus text-[10px]"></i>
                            <span>Columna DB</span>
                        </button>
                    </div>
                    <div class="border rounded-2xl overflow-hidden flex-1 overflow-y-auto shadow-2xs" :class="darkMode ? 'border-slate-800 bg-[#060913]/40' : 'border-slate-200 bg-white'">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="border-b text-[11px] font-black uppercase tracking-wider sticky top-0" :class="darkMode ? 'border-slate-800 bg-[#0b101e] text-slate-400' : 'border-slate-200 bg-slate-100 text-slate-600'">
                                    <th class="p-3 w-36">Acción</th>
                                    <th class="p-3">Tabla</th>
                                    <th class="p-3">Campo</th>
                                    <th class="p-3 w-32">Tipo</th>
                                    <th class="p-3">Descripción</th>
                                    <th class="p-3 text-right w-20">Acción</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y text-xs font-medium" :class="darkMode ? 'divide-slate-800/50' : 'divide-slate-200'">
                                <template v-for="(dbItem, dIdx) in huData.dbModel" :key="dIdx">
                                    <tr>
                                        <td class="p-2.5">
                                            <select v-model="dbItem.action" @change="saveLocal()" class="border rounded-xl px-2.5 py-1.5 text-xs text-indigo-400 font-bold w-full" :class="darkMode ? 'bg-[#060913] border-slate-800' : 'bg-white border-slate-300'">
                                                <option value="Crear">Crear</option>
                                                <option value="Modificar">Modificar</option>
                                                <option value="Agregar">Agregar</option>
                                                <option value="Insertar">Insertar</option>
                                                <option value="Actualizar">Actualizar</option>
                                            </select>
                                        </td>
                                        <td class="p-2.5">
                                            <input type="text" v-model="dbItem.table" @input="saveLocal()" class="border rounded-xl px-2.5 py-1.5 w-full text-xs font-mono font-bold" :class="darkMode ? 'bg-[#060913] border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-800'">
                                        </td>
                                        <td class="p-2.5">
                                            <input type="text" v-model="dbItem.field" @input="saveLocal()" class="border rounded-xl px-2.5 py-1.5 w-full text-xs font-mono font-bold" :class="darkMode ? 'bg-[#060913] border-slate-800 text-emerald-300' : 'bg-white border-slate-300 text-emerald-700'">
                                        </td>
                                        <td class="p-2.5">
                                            <input type="text" v-model="dbItem.type" @input="saveLocal()" class="border rounded-xl px-2.5 py-1.5 w-full text-xs font-mono font-bold" :class="darkMode ? 'bg-[#060913] border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-800'">
                                        </td>
                                        <td class="p-2.5">
                                            <input type="text" v-model="dbItem.description" @input="saveLocal()" class="border rounded-xl px-2.5 py-1.5 w-full text-xs font-medium" :class="darkMode ? 'bg-[#060913] border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-800'">
                                        </td>
                                        <td class="p-2.5 text-right">
                                            <button @click="removeDbField(dIdx)" class="hover:text-rose-500 transition p-1" :class="darkMode ? 'text-slate-600' : 'text-slate-400'" title="Eliminar campo">
                                                <i class="fas fa-trash text-xs"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Pestaña 4: Menú & Permisos Múltiples -->
                <div v-show="activeTab === 'menuPermisos'" class="flex-1 flex flex-col space-y-4 overflow-y-auto pr-1">
                    <div class="space-y-2">
                        <h3 class="text-xs font-black uppercase tracking-wider text-emerald-400"><i class="fas fa-sitemap mr-1.5"></i>Configuración de Menú Global</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl border text-xs shadow-2xs" :class="darkMode ? 'bg-[#060913]/60 border-slate-800' : 'bg-slate-50 border-slate-200'">
                            <div>
                                <span class="text-[10px] block mb-1 font-bold text-indigo-400">URL Global:</span>
                                <input type="text" v-model="huData.menu.url" @input="saveLocal()" class="w-full border rounded-xl px-3 py-2 font-mono text-xs font-bold" :class="darkMode ? 'bg-[#060913] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'">
                            </div>
                            <div>
                                <span class="text-[10px] block mb-1 font-bold text-slate-400">Descripción:</span>
                                <input type="text" v-model="huData.menu.description" @input="saveLocal()" class="w-full border rounded-xl px-3 py-2 text-xs font-medium" :class="darkMode ? 'bg-[#060913] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'">
                            </div>
                            <div>
                                <span class="text-[10px] block mb-1 font-bold text-slate-400">Menú Padre:</span>
                                <input type="text" v-model="huData.menu.parent" @input="saveLocal()" class="w-full border rounded-xl px-3 py-2 text-xs font-medium" :class="darkMode ? 'bg-[#060913] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'">
                            </div>
                            <div>
                                <span class="text-[10px] block mb-1 font-bold text-slate-400">Submenú:</span>
                                <input type="text" v-model="huData.menu.submenu" @input="saveLocal()" class="w-full border rounded-xl px-3 py-2 text-xs font-medium" :class="darkMode ? 'bg-[#060913] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'">
                            </div>
                        </div>
                    </div>

                    <!-- Permisos Múltiples -->
                    <div class="space-y-3">
                        <div class="flex justify-between items-center px-1">
                            <h3 class="text-xs font-black uppercase tracking-wider text-indigo-400"><i class="fas fa-lock mr-1.5"></i>Permisos de Acceso Múltiples</h3>
                            <button @click="addPermission()" class="text-xs bg-brand-600 hover:bg-brand-500 text-white px-3.5 py-1.5 rounded-xl font-bold shadow-xs flex items-center space-x-1.5 transition">
                                <i class="fas fa-plus text-[10px]"></i>
                                <span>Agregar Permiso</span>
                            </button>
                        </div>

                        <div class="space-y-3">
                            <template v-for="(perm, pIdx) in huData.permissionsList" :key="pIdx">
                                <div class="p-4 rounded-2xl border space-y-3 shadow-2xs relative transition hover:border-brand-500/50" :class="darkMode ? 'bg-[#060913]/60 border-slate-800' : 'bg-slate-50 border-slate-200'">
                                    <div class="flex justify-between items-center border-b pb-2" :class="darkMode ? 'border-slate-800' : 'border-slate-200'">
                                        <span class="text-xs font-black text-indigo-400 flex items-center space-x-1.5">
                                            <i class="fas fa-key text-[10px]"></i>
                                            <span v-text="'Permiso #' + (pIdx + 1)"></span>
                                        </span>
                                        <button @click="removePermission(pIdx)" class="text-slate-400 hover:text-rose-500 transition text-xs flex items-center space-x-1 px-2.5 py-1 rounded-xl hover:bg-rose-500/10 font-bold">
                                            <i class="fas fa-trash text-[10px]"></i>
                                            <span>Eliminar</span>
                                        </button>
                                    </div>
                                    
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-medium">
                                        <div>
                                            <span class="text-[10px] block mb-1 font-bold text-indigo-400">URL API del Permiso:</span>
                                            <input type="text" v-model="perm.urlApi" @input="saveLocal()" class="w-full border rounded-xl px-3 py-2 font-mono text-xs font-bold" :class="darkMode ? 'bg-[#060913] border-slate-800 text-indigo-300' : 'bg-white border-slate-300 text-indigo-600'" placeholder="/api/v1/...">
                                        </div>
                                        <div>
                                            <span class="text-[10px] block mb-1 font-bold text-slate-400">Descripción:</span>
                                            <input type="text" v-model="perm.description" @input="saveLocal()" class="w-full border rounded-xl px-3 py-2 text-xs" :class="darkMode ? 'bg-[#060913] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'" placeholder="Objetivo del permiso">
                                        </div>
                                        <div>
                                            <span class="text-[10px] block mb-1 font-bold text-slate-400">Menú Padre:</span>
                                            <input type="text" v-model="perm.parentMenu" @input="saveLocal()" class="w-full border rounded-xl px-3 py-2 text-xs" :class="darkMode ? 'bg-[#060913] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'" placeholder="Ej. Admin">
                                        </div>
                                        <div>
                                            <span class="text-[10px] block mb-1 font-bold text-slate-400">Submenú:</span>
                                            <input type="text" v-model="perm.submenu" @input="saveLocal()" class="w-full border rounded-xl px-3 py-2 text-xs" :class="darkMode ? 'bg-[#060913] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'" placeholder="Ej. Tours">
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Pestaña 5: Server & Store (Split View) -->
                <div v-show="activeTab === 'response'" class="flex-1 flex flex-col space-y-4 overflow-hidden">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 h-full">
                        <div class="flex flex-col space-y-2 h-full">
                            <label class="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5"><i class="fas fa-cubes"></i><span>SiteBuilder ➔ Frontend (Jerarquía)</span></label>
                            <textarea v-model="huData.storeAction" @input="saveLocal()" class="w-full flex-1 border rounded-2xl p-4 text-xs font-mono text-indigo-400 focus:outline-none resize-none shadow-2xs leading-relaxed font-bold" :class="darkMode ? 'bg-[#060913]/60 border-slate-800' : 'bg-slate-50 border-slate-300'" placeholder="Jerarquía enviada desde SiteBuilder..."></textarea>
                        </div>
                        <div class="flex flex-col space-y-2 h-full">
                            <label class="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5"><i class="fas fa-server"></i><span>Lo que Recibe el Frontend (Response Store)</span></label>
                            <textarea v-model="huData.mockResponse" @input="saveLocal()" class="w-full flex-1 border rounded-2xl p-4 text-xs font-mono text-emerald-400 focus:outline-none resize-none shadow-2xs leading-relaxed font-bold" :class="darkMode ? 'bg-[#060913]/60 border-slate-800' : 'bg-slate-50 border-slate-300'" placeholder="Estructura JSON que recibe el Frontend..."></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Modal para Pegar TS / JSON Tipado -->
    <div v-show="showJsonModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div class="border rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4" :class="darkMode ? 'bg-[#0b101e] border-slate-800 text-slate-100' : 'bg-white border-slate-300 text-slate-900'">
            <div class="flex justify-between items-center">
                <h3 class="font-black text-sm flex items-center space-x-2 text-indigo-400"><i class="fas fa-code"></i><span>Pegar JSON o Estructura Tipada</span></h3>
                <button @click="showJsonModal = false" class="text-slate-400 hover:text-slate-100"><i class="fas fa-times"></i></button>
            </div>
            <p class="text-xs opacity-70">Pega tu objeto JSON o estructura de propiedades para importarlas automáticamente como variables en el endpoint activo.</p>
            <textarea v-model="pastedJsonText" rows="8" class="w-full border rounded-2xl p-3 text-xs font-mono text-indigo-400 focus:outline-none" :class="darkMode ? 'bg-[#060913] border-slate-800' : 'bg-slate-50 border-slate-300'" placeholder='{"tour_id": "string", "is_active": true}'></textarea>
            <div class="flex justify-end space-x-3">
                <button @click="showJsonModal = false" class="px-4 py-2 rounded-xl border text-xs font-bold" :class="darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'">Cancelar</button>
                <button @click="importJsonToParams()" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md">Importar Variables</button>
            </div>
        </div>
    </div>

    <!-- Historial de versiones -->
    <div v-show="showHistoryModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div class="border rounded-3xl max-w-3xl w-full max-h-[85vh] p-6 shadow-2xl flex flex-col" :class="darkMode ? 'bg-[#0b101e] border-slate-800 text-slate-100' : 'bg-white border-slate-300 text-slate-900'">
            <div class="flex justify-between items-center mb-4"><div><h3 class="font-black text-sm"><i class="fas fa-clock-rotate-left text-indigo-400 mr-2"></i>Historial de versiones</h3><p class="text-[11px] opacity-60 mt-1">Cada versión conserva una copia de la HU y quién la guardó.</p></div><button @click="showHistoryModal = false" class="px-3 py-1.5 rounded-lg border text-xs">Cerrar</button></div>
            <div class="overflow-y-auto space-y-2">
                <template v-for="version in [...historyLog].reverse()" :key="version.id">
                    <div class="rounded-xl border p-3 flex flex-wrap justify-between items-center gap-3" :class="darkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'">
                        <div><div class="text-xs font-bold"><span v-text="'Versión ' + version.version"></span><span class="ml-2 text-indigo-400" v-text="version.action"></span></div><div class="text-[10px] opacity-60 mt-1"><span v-text="version.user"></span> · <span v-text="new Date(version.createdAt).toLocaleString()"></span> · <span v-text="version.folder || 'Sin carpeta'"></span> / <span v-text="version.sprint || 'Sin sprint'"></span></div></div>
                        <button @click="restoreVersion(version)" class="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-[10px] font-bold">Restaurar</button>
                    </div>
                </template>
                <p v-show="historyLog.length === 0" class="text-xs opacity-60 py-8 text-center">Aún no hay versiones guardadas. Se creará una al realizar el primer cambio.</p>
            </div>
        </div>
    </div>

    <!-- Modal para Consolidado JSON -->
    <div v-show="showShareModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div class="border rounded-3xl max-w-2xl w-full p-7 shadow-2xl space-y-4" :class="darkMode ? 'bg-[#0b101e] border-slate-800 text-slate-100' : 'bg-white border-slate-300 text-slate-900'">
            <div class="flex justify-between items-center">
                <h3 class="font-black text-sm flex items-center space-x-2 text-emerald-400"><i class="fas fa-file-code"></i><span>Consolidado Completo de la HU (Jira / Slack)</span></h3>
                <button @click="copyShareText()" class="text-xs bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl font-bold shadow-xs">Copiar al Portapapeles</button>
            </div>
            <textarea readonly v-model="shareTextOutput" rows="14" class="w-full border rounded-2xl p-4 text-xs font-mono text-indigo-400 focus:outline-none resize-none leading-relaxed font-bold" :class="darkMode ? 'bg-[#060913] border-slate-800' : 'bg-slate-50 border-slate-300'"></textarea>
            <div class="flex justify-end">
                <button @click="showShareModal = false" class="px-5 py-2.5 rounded-xl border text-xs font-bold" :class="darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'">Cerrar</button>
            </div>
        </div>
    </div>

    <div v-show="appDialog.open" class="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4" @keydown.escape.window="resolveAppDialog(false)" @click.self="resolveAppDialog(false)">
        <section role="dialog" aria-modal="true" :aria-labelledby="'app-dialog-title'" class="w-full max-w-md overflow-hidden rounded-3xl border shadow-2xl" :class="darkMode ? 'bg-[#0b101e] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'">
            <div class="p-6">
                <div class="flex items-start gap-3"><div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" :class="appDialog.kind === 'danger' ? 'bg-rose-500/15 text-rose-400' : appDialog.kind === 'success' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-brand-500/15 text-brand-400'"><i class="fas" :class="appDialog.kind === 'danger' ? 'fa-triangle-exclamation' : appDialog.kind === 'success' ? 'fa-check' : 'fa-circle-info'"></i></div><div><h3 id="app-dialog-title" class="text-sm font-black" v-text="appDialog.title"></h3><p class="mt-2 whitespace-pre-line text-xs leading-relaxed opacity-70" v-text="appDialog.message"></p></div></div>
                <div class="mt-6 flex justify-end gap-2"><button v-show="appDialog.showCancel" @click="resolveAppDialog(false)" class="rounded-xl border px-4 py-2 text-xs font-bold" :class="darkMode ? 'border-slate-700 hover:bg-slate-900' : 'border-slate-200 hover:bg-slate-50'" v-text="appDialog.cancelText"></button><button @click="resolveAppDialog(true)" class="rounded-xl px-4 py-2 text-xs font-bold text-white" :class="appDialog.kind === 'danger' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-brand-600 hover:bg-brand-500'" v-text="appDialog.confirmText"></button></div>
            </div>
        </section>
    </div>
    <div v-show="appToast.visible" class="fixed bottom-5 right-5 z-[160] flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl" :class="darkMode ? 'bg-[#0b101e] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'" role="status" aria-live="polite"><i class="fas mt-0.5" :class="appToast.kind === 'error' ? 'fa-circle-exclamation text-rose-400' : 'fa-circle-check text-emerald-400'"></i><span class="text-xs font-semibold" v-text="appToast.message"></span><button @click="appToast.visible=false" class="ml-auto opacity-50 hover:opacity-100" aria-label="Cerrar aviso"><i class="fas fa-times"></i></button></div>

    <!-- Script de Gestión Completo -->
    
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import { defineComponent, onMounted, toRefs } from 'vue'
import { useStoreFlow } from './composables/useStoreFlow'
export default defineComponent({ setup() {
  const app = useStoreFlow()
  // La plantilla monta también los paneles ocultos. Preparar los arreglos
  // anidados antes del primer render, sin esperar la carga asíncrona del usuario.
  app.ensureMeetingData()
  // Las propiedades con prefijo _ son estado interno (timers/resolvers) y
  // Vue no permite exponerlas como propiedades del componente.
  const publicKeys = Object.keys(app).filter(key => !key.startsWith('_'))
  const refs:any = toRefs(app)
  const bindings:any = {}
  for (const key of publicKeys) bindings[key] = refs[key]
  for (const key of publicKeys) if (typeof app[key] === "function") bindings[key] = app[key].bind(app)
  onMounted(() => { void app.init() })
  return bindings
} })
</script>

