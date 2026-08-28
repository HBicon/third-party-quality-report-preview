(function () {
  function note(area, title, text, behavior, decision, owner, status = 'confirmed') {
    return { area, title, text, behavior, decision, owner, status };
  }

  function gateNote(index) {
    return note(
      `${index} · 本场景结论`,
      '方案仍在 Gate 2 评审',
      '本场景只承载已通过 Gate 1 的范围和业务规则，当前演示数据不连接真实接口。',
      '请逐项确认主流程、关键状态、按钮行为、角色权限和异常处理；有修改意见时先回写原型与评审记录。',
      '未收到明确评审结论前，本场景不标记为评审通过，也不进入最终 Specification 与测试用例阶段。',
      '产品负责人、业务负责人',
      'blocking'
    );
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
        note('01 · 展示条件', '订单级展示资格', '订单来源开关已开启、订单进入平台时命中展示资格，且已存储的原始 JSON 可用。', '资格在订单进入平台时固化，后续配置变化不改变该订单的展示结果。', '按订单来源配置，并且只对配置生效后的订单有效。', '产品、后台研发'),
        note('02 · 默认视图', '原始报告为默认报价依据', '订单详情默认选中“三方原始报告”，展示三方字段名称、分组、顺序和原值。', '页面打开后直接读取平台现有三方报告存储表，不要求买家额外点击。', 'PC 与 App 共用同一展示资格和原始报告数据。', '产品、买家端研发'),
        note('03 · 报告切换', '两类报告可切换', '保留“平台映射报告”入口，买家可在原始报告和平台报告之间切换。', '切换只替换报告内容，不刷新订单详情，也不改变报价状态。', '平台映射报告继续沿用现有映射结果。', '产品、前端'),
        note('04 · 报价区域', '报价输入保持', '报告是报价参考信息，不新增报价前置限制。', '切换报告时保留已经填写的报价金额和备注；提交报价沿用现有流程。', '报告切换不得清空买家输入。', '业务、买家端研发'),
        note('05 · 数据口径', '按三方原始字段呈现', '原始报告展示三方 JSON 中的字段名称、分组、顺序和原值。', '本期不再次映射、归一化或隐藏三方专有质检项。', '原始数据读取平台现有专用存储表。', '产品、数据、接口研发'),
        gateNote('06')
      ]
    },
    'pc-fallback': {
      kicker: '买家 PC',
      title: '订单详情 · 原始报告缺失降级',
      subtitle: '已命中展示资格但原始报告未取到，自动展示平台映射报告。',
      viewport: 'PC 界面',
      noteTitle: 'PC 缺失降级',
      focus: '确认原始报告未取到时的降级提示，以及买家能否无阻断继续报价。',
      notes: [
        note('01 · 触发条件', '命中资格但原报告不可用', '订单已命中原报告展示资格，但原始 JSON 缺失、为空或无法正常读取。', '前端按接口返回的可用状态进入降级视图，不展示空白原始报告。', '原始报告不可用不改变订单待报价状态。', '产品、接口研发'),
        note('02 · 降级展示', '自动展示平台映射报告', '页面直接展示平台映射报告，并提示原始报告暂未获取。', '不展示不可点击的原始报告标签，避免买家反复尝试。', '提示只表达当前结果，不暴露内部错误原因。', '产品、买家端研发'),
        note('03 · 报价区域', '报价能力保持可用', '报价金额、备注和提交按钮均保持可用，不新增前置校验。', '买家可直接基于平台映射报告完成报价。', '原始报告缺失不能阻断报价。', '业务、买家端研发'),
        note('04 · 未命中差异', '不制造额外异常提示', '来源未开启或订单早于配置生效时，保持现有平台报告体验。', '未命中展示资格的订单不展示“原始报告暂未获取”提示。', '缺失提示只用于已命中资格但原报告不可用的订单。', '产品、后台研发'),
        gateNote('05')
      ]
    },
    'app-report': {
      kicker: '买家 App',
      title: '订单详情 · 原始报告默认展示',
      subtitle: 'App 与 PC 使用相同展示资格，报告字段改为单列浏览。',
      viewport: 'App 界面',
      noteTitle: 'App 原报告默认',
      focus: '确认移动端单列报告、双报告切换和底部报价入口的可达性。',
      notes: [
        note('01 · 规则一致', 'PC 与 App 共用资格', 'App 与 PC 共用订单进入平台时固化的展示资格和同一原始报告数据。', '同一订单在不同端查看时不重新计算展示资格。', '端侧差异只体现在布局，不体现在业务结果。', '产品、服务端研发'),
        note('02 · 移动布局', '报告字段单列浏览', '报告按三方分组纵向展开，字段名和值使用单列键值结构。', '字段内容随页面滚动，不横向压缩字段名和值。', '保持三方字段名称、分组、顺序和原值。', '产品、App 研发'),
        note('03 · 报告切换', '默认原始报告', '顶部双选项切换原始报告与平台报告，初始选中原始报告。', '切换只替换报告内容，订单信息和报价入口不刷新。', 'App 与 PC 的默认报告规则一致。', '产品、App 研发'),
        note('04 · 报价入口', '底部操作持续可达', '报价入口固定在手机页面底部，报告较长时仍可触达。', '报告滚动和切换不改变报价按钮可用性。', '提交报价继续沿用现有流程。', '业务、App 研发'),
        gateNote('05')
      ]
    },
    'app-fallback': {
      kicker: '买家 App',
      title: '订单详情 · 原始报告缺失降级',
      subtitle: 'App 自动展示平台映射报告，底部报价按钮持续可用。',
      viewport: 'App 界面',
      noteTitle: 'App 缺失降级',
      focus: '确认 App 原始报告缺失时的提示、平台报告降级和报价按钮状态。',
      notes: [
        note('01 · 降级规则', '直接呈现平台报告', '原始报告不可用时，不展示不可点击的报告切换，直接呈现平台映射报告。', '页面进入时完成降级，不要求买家手动选择。', '降级结果与 PC 保持一致。', '产品、App 研发'),
        note('02 · 用户提示', '提示不暴露内部错误', '页面说明已经自动降级且不影响报价。', '不展示 JSON 解析、接口失败或存储异常等内部原因。', '买家只需知道当前可用报告和报价状态。', '产品、App 研发'),
        note('03 · 报价入口', '立即报价保持可用', '底部“立即报价”始终可操作。', '点击后继续沿用现有报价流程，不增加确认或强制阅读。', '原始报告缺失不阻断买家报价。', '业务、App 研发'),
        note('04 · 端侧一致', '触发条件与 PC 一致', 'PC 与 App 使用相同展示资格、原始报告可用状态和降级结果。', '端侧只调整布局与交互容器，不独立定义降级规则。', '避免同一订单在不同端出现报告差异。', '产品、服务端研发'),
        gateNote('05')
      ]
    },
    'admin-list': {
      kicker: 'Boss 后台',
      title: '原始报告展示配置 · 来源列表',
      subtitle: '菜单路径：业务配置 > 三方平台管理 > 原始报告展示配置。',
      viewport: '后台界面',
      noteTitle: '来源配置列表',
      focus: '确认新增后台菜单、配置维度、筛选信息和只影响后续订单的生效说明。',
      notes: [
        note('01 · 菜单入口', '新增原始报告展示配置', '菜单路径为“业务配置 > 三方平台管理 > 原始报告展示配置”。', '进入后先展示全部已接入的独立订单来源。', '当前后台没有该菜单，本期新增。', '产品、后台研发'),
        note('02 · 配置维度', '按订单来源配置', '一行对应一个现有独立订单来源。', '不增加买家、门店、机型或单订单维度。', '复用现有订单来源作为稳定配置键。', '业务、后台研发'),
        note('03 · 列表与筛选', '展示配置与审计摘要', '列表展示订单来源、三方平台、开关状态、最后操作人和最后操作时间。', '支持按来源或平台名称搜索，并按开启状态筛选。', '原型仅展示 6 条脱敏示例，实际覆盖全部来源。', '产品、运营'),
        note('04 · 操作入口', '编辑操作需要确认', '有编辑权限时可进入配置详情或触发开关变更。', '开关不静默生效，保存前必须展示影响边界并二次确认。', '查看权限和编辑权限分离。', '产品、权限负责人'),
        note('05 · 生效说明', '只影响后续订单', '列表顶部持续提示保存后只影响之后进入平台的订单。', '订单进入平台时固化展示资格，历史订单不随开关变化。', '不追溯修改既有订单。', '业务、后台研发'),
        gateNote('06')
      ]
    },
    'admin-change': {
      kicker: 'Boss 后台',
      title: '原始报告展示配置 · 开关确认',
      subtitle: '配置页明确展示判断时间、资格固化和不追溯规则。',
      viewport: '后台界面',
      noteTitle: '开关确认',
      focus: '确认配置对象、开关保存、二次确认与资格固化规则是否表达完整。',
      notes: [
        note('01 · 配置对象', '来源信息只读', '平台名称和订单来源只用于确认配置对象。', '页面不允许修改平台与订单来源的绑定关系。', '本页只管理原始报告展示开关。', '产品、后台研发'),
        note('02 · 开关行为', '先调整再保存', '运营先切换状态，再点击保存。', '未发生变化时不提交，并反馈“配置未发生变化”。', '配置变化必须通过明确保存动作提交。', '产品、后台研发'),
        note('03 · 二次确认', '再次说明影响范围', '确认弹窗展示来源、配置变化和生效边界。', '取消时不保存；确认后写入新配置并给出成功反馈。', '只影响后续订单，既有订单资格不变。', '运营、后台研发'),
        note('04 · 判断时点', '订单进入平台时固化', '以三方订单进入平台时读取到的已生效配置为准。', '读取配置后立即固化该订单展示资格。', '后续开关变化不追溯订单。', '业务、服务端研发'),
        note('05 · 异常降级', '报告缺失不阻断报价', '确认弹窗同步说明原始报告未取到时的降级结果。', '买家端自动展示平台映射报告，报价继续可用。', '后台配置不改变既有报价规则。', '业务、买家端研发'),
        gateNote('06')
      ]
    },
    'admin-readonly': {
      kicker: 'Boss 后台',
      title: '原始报告展示配置 · 只读权限',
      subtitle: '查看权限与编辑权限分离，无编辑权限时不提供变更操作。',
      viewport: '后台界面',
      noteTitle: '只读权限',
      focus: '确认查看与编辑权限分离，以及无编辑权限时的页面反馈。',
      notes: [
        note('01 · 查看权限', '允许查看配置事实', '具备查看权限的角色可以进入菜单并查看来源配置状态。', '页面展示订单来源、平台、状态和最后操作信息。', '查看权限不授予配置变更能力。', '产品、权限负责人'),
        note('02 · 编辑权限', '无权限操作不可用', '没有编辑权限时，页面明确显示“仅查看”。', '配置按钮禁用，不展示可触发变更的开关或保存入口。', '查看与编辑权限分离。', '产品、后台研发'),
        note('03 · 权限反馈', '说明如何申请变更', '页面提示需要联系具备编辑权限的运营管理员。', '不隐藏当前配置事实，也不将无权限表现为空页面。', '用户能够区分无权限和无数据。', '产品、运营'),
        note('04 · 服务端校验', '不能只依赖前端禁用', '正式实现时查看和编辑操作均由服务端分别校验权限。', '权限被撤销后再次请求时返回无权限，页面保持只读并给出反馈。', '防止绕过页面直接修改配置。', '权限负责人、后台研发'),
        gateNote('05')
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
  const reviewProgress = document.getElementById('review-progress');
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

    stageKicker.textContent = info.kicker;
    stageTitle.textContent = info.title;
    stageSubtitle.textContent = info.subtitle;
    viewportLabel.textContent = info.viewport;
    noteTitle.textContent = info.noteTitle;
    reviewFocus.textContent = info.focus;

    const pendingCount = info.notes.filter((item) => item.status === 'pending').length;
    const blockingCount = info.notes.filter((item) => item.status === 'blocking').length;
    const confirmedCount = info.notes.length - pendingCount - blockingCount;
    reviewProgress.textContent = `已明确 ${confirmedCount} 项 · 待确认 ${pendingCount} 项 · 阻断 ${blockingCount} 项`;

    const statusLabels = { confirmed: '已明确', pending: '待确认', blocking: '阻断项' };
    const decisionLabels = { confirmed: '评审结论', pending: '待确认', blocking: '阻断原因' };
    noteList.innerHTML = info.notes.map((item) => `
      <div class="note ${item.status}">
        <div class="note-head"><span class="note-area">${item.area}</span><span class="note-status ${item.status}">${statusLabels[item.status]}</span></div>
        <strong>${item.title}</strong>
        <p>${item.text}</p>
        <div class="note-detail"><span>操作与状态</span>${item.behavior}</div>
        <div class="note-detail"><span>${decisionLabels[item.status]}</span>${item.decision}</div>
        <div class="note-owner">确认角色：${item.owner}</div>
      </div>
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
