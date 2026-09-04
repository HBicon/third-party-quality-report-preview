(function () {
  function note(title, text, status = 'confirmed') {
    return { title, text, status };
  }

  const sceneInfo = {
    'admin-list': {
      kicker: 'Boss 后台',
      title: '原始报告展示配置 · 来源列表',
      subtitle: '菜单路径：业务配置 > 三方平台管理 > 原始报告展示配置。',
      viewport: '后台界面',
      noteTitle: '来源配置列表',
      focus: '确认新增菜单中的列表字段、筛选能力和配置入口。',
      notes: [
        note('菜单与配置维度', '菜单位于“业务配置 > 三方平台管理 > 原始报告展示配置”，一行对应一个独立订单来源。'),
        note('配置与审计摘要', '建议展示来源、三方平台、开关状态、最后操作人和时间，并支持关键词与状态筛选。', 'pending'),
        note('生效边界常驻提示', '列表顶部持续说明保存后只影响后续进入平台的订单，历史订单不追溯。', 'pending'),
        note('编辑进入确认流程', '有编辑权限时可发起开关变更，保存前再次确认影响范围。', 'pending')
      ]
    },
    'admin-change': {
      kicker: 'Boss 后台',
      title: '原始报告展示配置 · 开关确认',
      subtitle: '配置页明确展示判断时间、资格固化和不追溯规则。',
      viewport: '后台界面',
      noteTitle: '开关确认',
      focus: '列表规则不重复，仅评审一次配置变更的完整闭环。',
      notes: [
        note('配置对象保持只读', '三方平台与订单来源只用于核对，本页仅调整原报告展示开关。', 'pending'),
        note('显式保存与幂等反馈', '先调整后保存；配置未变化时不提交，并提示“无需保存”。', 'pending'),
        note('二次确认影响范围', '确认弹窗同时展示来源、开关变化、后续订单生效和缺失降级规则。', 'pending'),
        note('订单进入时固化资格', '确认保存后读取到的新状态只用于后续进入平台的订单，既有资格不变。')
      ]
    },
    'admin-readonly': {
      kicker: 'Boss 后台',
      title: '原始报告展示配置 · 只读权限',
      subtitle: '查看权限与编辑权限分离，无编辑权限时不提供变更操作。',
      viewport: '后台界面',
      noteTitle: '只读权限',
      focus: '仅评审无编辑权限时的信息可见性和操作反馈。',
      notes: [
        note('查看与编辑权限分离', '具备查看权限的角色可见配置事实，但不因此获得修改能力。'),
        note('无权限操作明确不可用', '页面显示“仅查看”，禁用配置入口，并提示联系有权限的运营管理员。', 'pending'),
        note('前后端分别校验', '正式实现需由服务端校验编辑权限；权限撤销后页面保持只读并反馈无权限。', 'pending')
      ]
    }
  };

  const sceneButtons = Array.from(document.querySelectorAll('[data-scene-target]'));
  const scenes = Array.from(document.querySelectorAll('[data-scene]'));
  const stageKicker = document.getElementById('stage-kicker');
  const stageTitle = document.getElementById('stage-title');
  const stageSubtitle = document.getElementById('stage-subtitle');
  const viewportLabel = document.getElementById('viewport-label');
  const noteTitle = document.getElementById('note-title');
  const noteList = document.getElementById('note-list');
  const reviewFocus = document.getElementById('review-focus');
  const sceneNames = new Set(Object.keys(sceneInfo));

  function getSceneFromUrl() {
    const requestedScene = new URL(window.location.href).searchParams.get('screen');
    return sceneNames.has(requestedScene) ? requestedScene : 'admin-list';
  }

  function showScene(name, options = {}) {
    const resolvedName = sceneInfo[name] ? name : 'admin-list';
    const info = sceneInfo[resolvedName];

    scenes.forEach((scene) => {
      scene.hidden = scene.dataset.scene !== resolvedName;
    });

    sceneButtons.forEach((button) => {
      const active = button.dataset.sceneTarget === resolvedName;
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });

    if (window.innerWidth <= 860) {
      const activeButton = sceneButtons.find((button) => button.dataset.sceneTarget === resolvedName);
      window.setTimeout(() => {
        const sidebar = activeButton?.closest('.scene-sidebar');
        if (!sidebar || !activeButton) return;
        sidebar.scrollLeft = Math.max(0, activeButton.offsetLeft - (sidebar.clientWidth - activeButton.offsetWidth) / 2);
      }, 0);
    }

    stageKicker.textContent = info.kicker;
    stageTitle.textContent = info.title;
    stageSubtitle.textContent = info.subtitle;
    viewportLabel.textContent = info.viewport;
    noteTitle.textContent = info.noteTitle;
    reviewFocus.textContent = info.focus;

    const statusLabels = { confirmed: '已确认', pending: '待评审' };
    noteList.innerHTML = info.notes.map((item) => `
      <li><strong>${item.title}</strong><p>${item.text}</p><span class="note-status ${item.status}">${statusLabels[item.status]}</span></li>
    `).join('');

    if (options.updateUrl !== false) {
      const url = new URL(window.location.href);
      url.searchParams.set('screen', resolvedName);
      window.history.pushState({ screen: resolvedName }, '', url);
    }
    document.getElementById('prototype-main').scrollLeft = 0;
  }

  sceneButtons.forEach((button) => {
    button.addEventListener('click', () => showScene(button.dataset.sceneTarget));
  });

  document.querySelectorAll('[data-scene-link]').forEach((button) => {
    button.addEventListener('click', () => showScene(button.dataset.sceneLink));
  });

  window.addEventListener('popstate', () => showScene(getSceneFromUrl(), { updateUrl: false }));

  function openDialog(id) {
    const dialog = document.getElementById(id);
    if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
  }

  function closeDialog(id) {
    const dialog = document.getElementById(id);
    if (dialog && dialog.open) dialog.close();
  }

  document.querySelectorAll('[data-close-dialog]').forEach((button) => {
    button.addEventListener('click', () => closeDialog(button.dataset.closeDialog));
  });

  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.hidden = true;
    }, 2800);
  }

  const sourceSearch = document.getElementById('source-search');
  const sourceStatus = document.getElementById('source-status');
  const sourceRows = Array.from(document.querySelectorAll('[data-source-row]'));
  const sourceResultCount = document.getElementById('source-result-count');

  function filterSources() {
    const keyword = (sourceSearch.value || '').trim().toLowerCase();
    const status = sourceStatus.value;
    let visible = 0;

    sourceRows.forEach((row) => {
      const keywordMatch = !keyword || row.dataset.name.toLowerCase().includes(keyword);
      const statusMatch = status === 'all' || row.dataset.status === status;
      row.hidden = !(keywordMatch && statusMatch);
      if (!row.hidden) visible += 1;
    });

    sourceResultCount.textContent = `示例显示 ${visible} / 6，实际共 12 个订单来源`;
  }

  sourceSearch.addEventListener('input', filterSources);
  sourceStatus.addEventListener('change', filterSources);
  document.getElementById('reset-source-filter').addEventListener('click', () => {
    sourceSearch.value = '';
    sourceStatus.value = 'all';
    filterSources();
  });

  const configDialogSource = document.getElementById('config-dialog-source');
  const configDialogChange = document.getElementById('config-dialog-change');
  let pendingConfigLabel = '';
  let pendingConfigState = '';

  function prepareConfigDialog(source, nextState) {
    pendingConfigLabel = source;
    pendingConfigState = nextState;
    configDialogSource.textContent = source;
    configDialogChange.textContent = nextState === 'on' ? '未开启 → 已开启' : '已开启 → 未开启';
    openDialog('config-confirm-dialog');
  }

  document.querySelectorAll('[data-open-config]').forEach((button) => {
    button.addEventListener('click', () => {
      prepareConfigDialog(button.dataset.source, button.dataset.next);
    });
  });

  const detailSwitch = document.getElementById('detail-config-switch');
  const detailInitialState = true;

  detailSwitch.addEventListener('click', () => {
    const nextOn = !detailSwitch.classList.contains('on');
    detailSwitch.classList.toggle('on', nextOn);
    detailSwitch.setAttribute('aria-checked', String(nextOn));
    detailSwitch.querySelector('b').textContent = nextOn ? '已开启' : '未开启';
  });

  document.getElementById('save-detail-config').addEventListener('click', () => {
    const currentOn = detailSwitch.classList.contains('on');
    if (currentOn === detailInitialState) {
      showToast('配置未发生变化，无需保存。');
      return;
    }
    prepareConfigDialog('机大侠 / JDAX', currentOn ? 'on' : 'off');
  });

  document.getElementById('confirm-config-change').addEventListener('click', () => {
    closeDialog('config-confirm-dialog');
    const stateText = pendingConfigState === 'on' ? '开启' : '关闭';
    showToast(`${pendingConfigLabel} 已${stateText}，只影响后续进入平台的订单。`);
  });

  showScene(getSceneFromUrl(), { updateUrl: false });
})();
