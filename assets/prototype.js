(function () {
  const sceneInfo = {
    'pc-report': {
      kicker: '买家 PC',
      title: '订单详情 · 原始报告默认展示',
      subtitle: '命中展示资格且原始 JSON 可用，默认展示三方原始报告。',
      viewport: 'PC 界面',
      noteTitle: '01 · PC 原报告默认',
      notes: [
        ['展示条件', '订单来源开关已开启、订单进入平台时命中展示资格，且已存储的原始 JSON 可用。'],
        ['默认视图', '订单详情默认选中“三方原始报告”，展示三方字段名称、分组、顺序和原值。'],
        ['报告切换', '保留“平台映射报告”入口；切换仅替换报告内容，不刷新页面。'],
        ['数据来源', '原始报告读取平台现有三方报告存储表；平台报告沿用当前映射结果。'],
        ['报价行为', '切换报告不清空已填写金额或备注，提交报价沿用现有流程。']
      ]
    },
    'pc-fallback': {
      kicker: '买家 PC',
      title: '订单详情 · 原始报告缺失降级',
      subtitle: '已命中展示资格但原始报告未取到，自动展示平台映射报告。',
      viewport: 'PC 界面',
      noteTitle: '02 · PC 缺失降级',
      notes: [
        ['触发条件', '订单已命中原报告展示资格，但原始 JSON 缺失、为空或无法正常读取。'],
        ['降级展示', '页面直接展示平台映射报告，并提示原始报告暂未获取。'],
        ['报价可用', '报价金额、备注和提交按钮均保持可用，不新增前置校验。'],
        ['未命中差异', '来源未开启或订单早于配置生效时，保持现有平台报告体验，不展示缺失提示。']
      ]
    },
    'app-report': {
      kicker: '买家 App',
      title: '订单详情 · 原始报告默认展示',
      subtitle: 'App 与 PC 使用相同展示资格，报告字段改为单列浏览。',
      viewport: 'App 界面',
      noteTitle: '03 · App 原报告默认',
      notes: [
        ['规则一致', 'App 与 PC 共用订单进入平台时固化的展示资格和同一原始报告数据。'],
        ['移动布局', '报告按三方分组纵向展开，字段名和值使用单列键值结构，适合连续滚动。'],
        ['报告切换', '顶部使用双选项切换原始报告与平台报告，默认原始报告。'],
        ['报价入口', '底部报价按钮固定可达，报告滚动和切换不改变报价可用性。']
      ]
    },
    'app-fallback': {
      kicker: '买家 App',
      title: '订单详情 · 原始报告缺失降级',
      subtitle: 'App 自动展示平台映射报告，底部报价按钮持续可用。',
      viewport: 'App 界面',
      noteTitle: '04 · App 缺失降级',
      notes: [
        ['降级规则', '原始报告不可用时，不展示不可点击的报告切换，直接呈现平台映射报告。'],
        ['用户提示', '提示说明已经自动降级且不影响报价，不暴露内部错误原因。'],
        ['报价行为', '底部“立即报价”始终可操作，继续沿用现有报价流程。'],
        ['端侧一致', 'PC 与 App 的触发条件和业务结果一致，仅布局不同。']
      ]
    },
    'admin-list': {
      kicker: 'Boss 后台',
      title: '原始报告展示配置 · 来源列表',
      subtitle: '菜单路径：业务配置 > 三方平台管理 > 原始报告展示配置。',
      viewport: '后台界面',
      noteTitle: '05 · 来源配置列表',
      notes: [
        ['配置维度', '一行对应一个现有独立订单来源，不增加买家、门店、机型或单订单维度。'],
        ['列表信息', '展示订单来源、三方平台、开关状态、最后操作人和最后操作时间。'],
        ['筛选能力', '支持按来源或平台名称搜索，并按开启状态筛选。'],
        ['操作入口', '有编辑权限时可进入配置或直接触发开关确认；开关不直接静默生效。'],
        ['生效说明', '列表顶部持续提示只影响后续进入平台的订单，避免误解历史影响。']
      ]
    },
    'admin-change': {
      kicker: 'Boss 后台',
      title: '原始报告展示配置 · 开关确认',
      subtitle: '配置页明确展示判断时间、资格固化和不追溯规则。',
      viewport: '后台界面',
      noteTitle: '06 · 开关确认',
      notes: [
        ['只读来源', '平台名称和订单来源只用于确认配置对象，页面不允许修改来源。'],
        ['开关行为', '运营先切换状态，再点击保存；未发生变化时不提交。'],
        ['二次确认', '确认弹窗再次说明“只影响后续订单、既有订单资格不变”。'],
        ['判断时点', '以三方订单进入平台时读取到的已生效配置为准，并立即固化资格。'],
        ['异常降级', '弹窗同步说明原始报告缺失不阻断买家报价。']
      ]
    },
    'admin-readonly': {
      kicker: 'Boss 后台',
      title: '原始报告展示配置 · 只读权限',
      subtitle: '查看权限与编辑权限分离，无编辑权限时不提供变更操作。',
      viewport: '后台界面',
      noteTitle: '07 · 只读权限',
      notes: [
        ['查看权限', '具备查看权限的角色可以进入菜单并查看来源配置状态。'],
        ['编辑权限', '没有编辑权限时，页面明确显示“仅查看”，配置操作不可用。'],
        ['权限反馈', '页面说明需要联系具备编辑权限的运营管理员，不隐藏当前配置事实。'],
        ['接口约束', '正式实现时查看和编辑操作均需由服务端分别校验权限。']
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

  function showScene(name, updateHash) {
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

    stageKicker.textContent = info.kicker;
    stageTitle.textContent = info.title;
    stageSubtitle.textContent = info.subtitle;
    viewportLabel.textContent = info.viewport;
    noteTitle.textContent = info.noteTitle;
    noteList.innerHTML = '';

    info.notes.forEach(([heading, copy]) => {
      const item = document.createElement('li');
      const strong = document.createElement('strong');
      strong.textContent = heading;
      item.append(strong, document.createTextNode(copy));
      noteList.appendChild(item);
    });

    if (updateHash !== false) {
      window.history.replaceState(null, '', `#${resolvedName}`);
    }
    document.getElementById('prototype-main').scrollLeft = 0;
  }

  sceneButtons.forEach((button) => {
    button.addEventListener('click', () => showScene(button.dataset.sceneTarget));
  });

  document.querySelectorAll('[data-scene-link]').forEach((button) => {
    button.addEventListener('click', () => showScene(button.dataset.sceneLink));
  });

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

  const initialScene = window.location.hash.slice(1);
  showScene(sceneInfo[initialScene] ? initialScene : 'pc-report', false);
})();
