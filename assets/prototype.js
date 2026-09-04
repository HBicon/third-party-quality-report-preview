(function () {
  function note(title, text, status = 'confirmed') {
    return { title, text, status };
  }

  const sceneInfo = {
    'pc-report': {
      kicker: '买家 PC',
      title: '订单详情 · 原始报告默认展示',
      subtitle: '命中展示资格且原始 JSON 可用，默认展示三方原始报告。',
      viewport: 'PC 界面',
      noteTitle: 'PC 原报告默认',
      focus: '确认原始报告默认展示、报告切换和报价输入保持是否符合买家报价流程。',
      notes: [
        note('订单级展示资格', '来源开关开启且订单进入平台时命中资格，并存在有效原始 JSON；资格一经固化不随配置变化。'),
        note('原报告默认，可切换映射报告', '页面默认展示三方原始报告；切换只替换报告内容，不刷新订单详情。'),
        note('原始字段通用呈现', '建议保留三方字段名、分组、顺序和原值，不再做二次映射或归一化。', 'pending'),
        note('报价输入保持', '报告仅作为报价参考，切换报告不清空金额与备注，提交仍沿用现有流程。', 'pending')
      ]
    },
    'pc-fallback': {
      kicker: '买家 PC',
      title: '订单详情 · 原始报告缺失降级',
      subtitle: '已命中展示资格但原始报告未取到，自动展示平台映射报告。',
      viewport: 'PC 界面',
      noteTitle: 'PC 缺失降级',
      focus: '仅评审与默认态不同的降级提示、报告入口和报价状态。',
      notes: [
        note('仅命中资格后触发', '原始 JSON 缺失、为空或不可读时进入降级；未命中资格的订单保持现有体验，不展示异常提示。'),
        note('直接展示平台映射报告', '不展示空白或不可点击的原报告标签，只说明当前已自动降级，不暴露内部错误。', 'pending'),
        note('报价能力保持可用', '金额、备注和提交按钮均保持可用，不新增报价前置校验。')
      ]
    },
    'app-report': {
      kicker: '买家 App',
      title: '订单详情 · 原始报告默认展示',
      subtitle: 'App 与 PC 使用相同展示资格，报告字段改为单列浏览。',
      viewport: 'App 界面',
      noteTitle: 'App 原报告默认',
      focus: 'PC 通用规则不重复，仅评审移动端布局与操作可达性。',
      notes: [
        note('与 PC 共用业务结果', '同一订单不因查看端变化而重新计算资格，默认报告与降级结果保持一致。'),
        note('报告字段单列浏览', '报告按三方分组纵向展开，长字段随页面滚动，不横向压缩。', 'pending'),
        note('底部报价入口持续可达', '报告较长或发生切换时，“立即报价”仍固定在手机页面底部。', 'pending')
      ]
    },
    'app-fallback': {
      kicker: '买家 App',
      title: '订单详情 · 原始报告缺失降级',
      subtitle: 'App 自动展示平台映射报告，底部报价按钮持续可用。',
      viewport: 'App 界面',
      noteTitle: 'App 缺失降级',
      focus: '仅评审 App 降级态与 PC 降级态的布局差异。',
      notes: [
        note('自动呈现平台报告', '进入页面即完成降级，不要求买家手动选择，也不展示不可用切换项。', 'pending'),
        note('提示压缩为结果说明', '只告知已展示平台映射报告且不影响报价，不显示接口或 JSON 错误。', 'pending'),
        note('立即报价保持可用', '底部按钮沿用现有流程，不增加确认或强制阅读。')
      ]
    },
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
    return sceneNames.has(requestedScene) ? requestedScene : 'pc-report';
  }

  function showScene(name, options = {}) {
    const resolvedName = sceneInfo[name] ? name : 'pc-report';
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

  document.querySelectorAll('.quality-section').forEach((section) => {
    const buttons = Array.from(section.querySelectorAll('[data-report-view]'));
    const panels = Array.from(section.querySelectorAll('[data-report-panel]'));

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const view = button.dataset.reportView;
        buttons.forEach((item) => {
          const active = item.dataset.reportView === view;
          item.classList.toggle('active', active);
          item.setAttribute('aria-selected', String(active));
        });
        panels.forEach((panel) => {
          panel.hidden = panel.dataset.reportPanel !== view;
        });
      });
    });
  });

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

  document.querySelectorAll('[data-submit-quote]').forEach((button) => {
    button.addEventListener('click', () => openDialog('quote-dialog'));
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
