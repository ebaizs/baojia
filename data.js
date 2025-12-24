// 项目数据结构
let projectData = {
    projectName: "",
    home: {
        base: [],
        auxiliary: [],
        furniture: [],
        other: []
    },
    commercial: {
        base: [],
        auxiliary: [],
        furniture: [],
        other: []
    },
    library: [],
    spaces: {
        home: [
            "客厅", "餐厅", "主卧", "次卧", "儿童房", "书房",
            "厨房", "卫生间", "阳台", "玄关", "走廊", "衣帽间",
            "老人房", "客房", "储物间", "阁楼", "地下室", "花园"
        ],
        commercial: [
            "前台", "办公区", "会议室", "经理室", "财务室",
            "茶水间", "卫生间", "走廊", "楼梯间", "电梯厅",
            "展厅", "仓库", "机房", "档案室", "休息区",
            "培训室", "接待室", "总经理办公室", "开放办公区"
        ]
    }
};

// 当前选中的类型和类别
let currentType = 'home';
let currentCategory = 'base';

// 项目示例库
const quickAddExamples = [
    { "name": "平面吊顶", "price": 160, "unit": "平米", "category": "base", "description": "橙色加厚型轻钢龙骨框架，泰山石膏板贴面" },
    { "name": "直线吊顶", "price": 115, "unit": "米", "category": "base", "description": "橙色加厚型轻钢龙骨框架，泰山石膏板贴面" },
    { "name": "双层叠级石膏线", "price": 35, "unit": "米", "category": "base", "description": "3层石膏板带叠级造型" },
    { "name": "窗帘盒", "price": 125, "unit": "米", "category": "base", "description": "欧松板基层，纸面石膏板贴面" },
    { "name": "影视墙造型", "price": 3000, "unit": "项", "category": "base", "description": "详见施工图" },
    { "name": "墙面基层处理", "price": 29, "unit": "平米", "category": "base", "description": "墙面界面剂+石膏粉找平+腻子粉打底，顺平工艺29元/平米，冲筋工艺75元/平米" },
    { "name": "墙面乳胶漆", "price": 18, "unit": "平米", "category": "base", "description": "立邦竹炭抗甲醛净味五合一乳胶漆18元/平米，立邦净味欧倍丽乳胶漆10元/平米" },
    { "name": "顶面基层处理", "price": 29, "unit": "平米", "category": "base", "description": "墙面界面剂+石膏粉找平+腻子粉打底，顺平工艺29元/平米，冲筋工艺75元/平米" },
    { "name": "顶面乳胶漆", "price": 18, "unit": "平米", "category": "base", "description": "立邦竹炭抗甲醛净味五合一乳胶漆" },
    { "name": "木饰面墙板造型", "price": 180, "unit": "平米", "category": "base", "description": "竹木纤维高端品牌饰面板" },
    { "name": "沙发背景造型", "price": 180, "unit": "平米", "category": "base", "description": "竹木纤维高端品牌饰面板" },
    { "name": "顶面石膏线", "price": 50, "unit": "平米", "category": "base", "description": "双层石膏板造型，详见图纸" },
    { "name": "其它造型", "price": 3000, "unit": "平米", "category": "base", "description": "墙面其它造型，预估" },
    { "name": "床头造型", "price": 380, "unit": "平米", "category": "base", "description": "竹木纤维高端品牌饰面板" },
    { "name": "电路改造", "price": 7000, "unit": "项", "category": "base", "description": "预收，完工后据实结算" },
    { "name": "弱电改造", "price": 25, "unit": "米", "category": "base", "description": "电话线、音箱、网线，混凝土开槽28元每米，墙砖每米25元，明线每米20元" },
    { "name": "水路改造", "price": 78, "unit": "米", "category": "base", "description": "暗管每米68元，明管每米55元" },
    { "name": "下水改造", "price": 100, "unit": "米", "category": "base", "description": "改下水（50管）每米100元" },
    { "name": "防水施工", "price": 75, "unit": "平米", "category": "base", "description": "（法国德高刚柔）防水涂料每平米55元，防水布每平米45元" },
    { "name": "墙体拆除", "price": 80, "unit": "平米", "category": "base", "description": "拆除及外运" },
    { "name": "新建墙体", "price": 290, "unit": "平米", "category": "base", "description": "封门洞，红砖打底，轻质块+双层挂网" },
    { "name": "地砖", "price": 70, "unit": "平米", "category": "auxiliary", "description": "客餐厅及走廊、所有卧室、书房、厨房、阳台，含损耗及运输搬运费，800*800通体抛釉地砖，按每块45元/计价，普通款39元/块" },
    { "name": "墙砖", "price": 70, "unit": "平米", "category": "auxiliary", "description": "厨房/卫生间/阳台墙砖、卫生间地砖800*400瓷砖（800*800瓷砖一切二），含损耗及运输搬运费<br>通体抛釉瓷砖，按每块45元/计价<br>普通300*600瓷片7.5元/块" },
    { "name": "木地板", "price": 280, "unit": "平米", "category": "auxiliary", "description": "实木复合地板，含安装（安心品牌）" },
    { "name": "瓷砖铺贴费", "price": 18000, "unit": "项", "category": "auxiliary", "description": "红砖包立管，墙面滚胶，瓷砖背胶，水泥砂浆，胶粉，倒角等费用，预估" },
    { "name": "地面找平费", "price": 3000, "unit": "项", "category": "auxiliary", "description": "水泥沙浆找平，预估" },
    { "name": "集成吊顶", "price": 85, "unit": "平米", "category": "auxiliary", "description": "品牌款300*600铝扣板吊顶" },
    { "name": "蜂窝铝板吊顶", "price": 165, "unit": "平米", "category": "auxiliary", "description": "蜂窝铝板，线形灯带另算" },
    { "name": "木门", "price": 1780, "unit": "套", "category": "auxiliary", "description": "实木复合门，带挂板，含磁吸门锁、门吸等，普通款1280元" },
    { "name": "双包垭口套", "price": 129, "unit": "米", "category": "auxiliary", "description": "实木复合材质" },
    { "name": "单包套", "price": 98, "unit": "米", "category": "auxiliary", "description": "实木复合材质" },
    { "name": "推拉门", "price": 620, "unit": "平米", "category": "auxiliary", "description": "极窄边钛镁合金-钢化玻璃门，普通款520元/平米" },
    { "name": "防盗门", "price": 3000, "unit": "项", "category": "auxiliary", "description": "春天品牌防盗门" },
    { "name": "定制衣柜", "price": 980, "unit": "平米", "category": "auxiliary", "description": "品牌颗粒板基层，部分玻璃门及PET门板" },
    { "name": "定制薄柜", "price": 600, "unit": "米", "category": "auxiliary", "description": "定制薄柜制作安装" },
    { "name": "厨房柜", "price": 9500, "unit": "项", "category": "auxiliary", "description": "5.3米地柜、3.5米吊柜、石英石台面，地柜多层板基层，PET门板，普通款7800元" },
    { "name": "壁布", "price": 55, "unit": "平米", "category": "auxiliary", "description": "含损耗，含2.8M定尺计算" },
    { "name": "马桶", "price": 1080, "unit": "项", "category": "auxiliary", "description": "预估" },
    { "name": "浴室柜及镜柜", "price": 2900, "unit": "套", "category": "auxiliary", "description": "预估" },
    { "name": "花洒", "price": 1680, "unit": "项", "category": "auxiliary", "description": "恒温高端花洒，含安装，其中一个用嵌入式顶喷花洒" },
    { "name": "淋浴隔断", "price": 1650, "unit": "项", "category": "auxiliary", "description": "极窄边枪灰色弧形钢化玻璃隔断，含石基与安装" },
    { "name": "改地暖管", "price": 60, "unit": "平米", "category": "auxiliary", "description": "PE日丰管" },
    { "name": "地暖分水器", "price": 150, "unit": "区", "category": "auxiliary", "description": "地暖分水器" },
    { "name": "地暖回填", "price": 30, "unit": "平米", "category": "auxiliary", "description": "水泥沙浆回填" },
    { "name": "地漏", "price": 115, "unit": "只", "category": "auxiliary", "description": "潜水艇品牌，铜芯镀铬淋浴专用地漏，普通款55元/套" },
    { "name": "窗台板", "price": 1450, "unit": "项", "category": "auxiliary", "description": "2套飘窗台面，2套普通窗台板，石英石材质，普通石材980元" },
    { "name": "开关插座", "price": 2680, "unit": "项", "category": "auxiliary", "description": "德力西品牌灰色高档款开关插座，LED射灯，普通款1680元" },
    { "name": "辅助灯具", "price": 130, "unit": "套", "category": "auxiliary", "description": "品牌产品，普通款80元/套" },
    { "name": "瓷砖美缝", "price": 3000, "unit": "项", "category": "auxiliary", "description": "预估" },
    { "name": "踢脚线", "price": 25, "unit": "米", "category": "auxiliary", "description": "实木踢脚线，普通高分子款15元/米" },
    { "name": "楼梯", "price": 12000, "unit": "项", "category": "auxiliary", "description": "预估" },
    { "name": "定制窗户", "price": 550, "unit": "平米", "category": "auxiliary", "description": "65型三层断桥铝钢化玻璃窗，含精钢网，开启扇（含内倒）" },
    { "name": "卫生间暖气片", "price": 780, "unit": "组", "category": "auxiliary", "description": "品牌铜铝复合材质，含温控阀及安装780元，普通碳钢款550元/套，含安装" },
    { "name": "其它预估项", "price": 3000, "unit": "项", "category": "auxiliary", "description": "可能未考虑到的项目，不发生部分退于甲方" },
    { "name": "中央空调", "price": 25000, "unit": "项", "category": "furniture", "description": "格力品牌，一拖五，预估" },
    { "name": "普通空调", "price": 1800, "unit": "项", "category": "furniture", "description": "预估" },
    { "name": "烟机", "price": 3000, "unit": "台", "category": "furniture", "description": "抽油烟机，含安装" },
    { "name": "炉灶", "price": 1500, "unit": "台", "category": "furniture", "description": "燃气灶具，含安装" },
    { "name": "热水器", "price": 2900, "unit": "套", "category": "furniture", "description": "含安装" },
    { "name": "小厨宝", "price": 455, "unit": "项", "category": "furniture", "description": "小厨宝370元，安装及配件费85元" },
    { "name": "洗衣机", "price": 1799, "unit": "项", "category": "furniture", "description": "米家智能洗烘一体洗衣机" },
    { "name": "冰箱", "price": 4599, "unit": "项", "category": "furniture", "description": "海尔智能零距离冰箱" },
    { "name": "家具", "price": 20000, "unit": "套", "category": "furniture", "description": "4张卧室床，床头柜4只，三人沙发，单人沙发，沙发凳2个，茶几，电视柜，岛台餐桌，餐椅6把，书桌椅2把，负1F大板桌（配6把椅）" },
    { "name": "窗帘", "price": 4900, "unit": "项", "category": "furniture", "description": "预估" },
    { "name": "装饰画", "price": 3150, "unit": "项", "category": "furniture", "description": "据实结算" },
    { "name": "配饰", "price": 2150, "unit": "项", "category": "furniture", "description": "配饰，摆件等" },
    { "name": "管理费", "price": 10000, "unit": "项", "category": "other", "description": "象征性收取" },
    { "name": "设计费", "price": 6000, "unit": "项", "category": "other", "description": "象征性收取" },
    { "name": "成品保护费", "price": 2150, "unit": "项", "category": "other", "description": "按建筑面积收取，地面防刮保护及成品柜防尘保护" }
];

// 空间产品库（用于快速模板）
const kongjianchanpin = {
    home: [
        { space: "客厅", name: ["平面吊顶", "直线吊顶", "双层叠级石膏线", "顶面石膏线","窗帘盒", "影视墙造型", "墙面基层处理", "墙面乳胶漆", "顶面基层处理", "顶面乳胶漆", "木饰面墙板造型", "沙发背景造型" , "其它造型"] },
        { space: "主卧室", name: ["平面吊顶", "直线吊顶","床头造型", "双层叠级石膏线", "窗帘盒", "墙面基层处理", "墙面乳胶漆", "顶面基层处理", "顶面乳胶漆" ] },
        { space: "次卧室", name: ["直线吊顶", "双层叠级石膏线","床头造型", "窗帘盒", "墙面基层处理", "墙面乳胶漆", "顶面基层处理", "顶面乳胶漆"] },
        { space: "小卧室", name: ["直线吊顶", "双层叠级石膏线", "床头造型","窗帘盒", "墙面基层处理", "墙面乳胶漆", "顶面基层处理", "顶面乳胶漆"] },
        { space: "改造部分", name: ["电路改造", "弱电改造", "水路改造", "下水改造", "防水施工", "墙体拆除", "新建墙体"] },
        { space: "全屋", name: ["地砖", "墙砖", "木地板","瓷砖铺贴费", "地面找平费","集成吊顶", "壁布", "家具", "窗帘", "装饰画", "配饰"] },
        { space: "门及窗套", name: ["木门", "双包垭口套", "单包套", "推拉门", "防盗门"] },
        { space: "定制柜类", name: ["定制衣柜", "定制薄柜", "厨房柜"] },
        { space: "卫浴类", name: ["马桶", "浴室柜及镜柜", "花洒", "淋浴隔断"] },
        { space: "其它", name: ["改地暖管", "地暖分水器", "地暖回填", "地漏", "窗台板", "开关插座", "辅助灯具", "瓷砖美缝", "踢脚线", "楼梯", "定制窗户", "卫生间暖气片", "其它预估项"] },
        { space: "家电设备", name: ["中央空调", "普通空调"] },
        { space: "厨房电器", name: ["烟机", "炉灶"] },
        { space: "其它家电", name: ["热水器", "小厨宝", "洗衣机", "冰箱"] },
        { space: "全屋", name: [ "管理费", "设计费","成品保护费", ] }  
    ],
    commercial: [
        { space: "办公空间", name: ["墙面乳胶漆", "顶面乳胶漆"] },
        { space: "全屋", name: [ "管理费", "设计费","成品保护费", ] }  
    ]
};

// 保存数据到本地存储
function saveDataToStorage() {
    try {
        const dataToSave = {
            projectName: projectData.projectName,
            home: projectData.home,
            commercial: projectData.commercial,
            library: projectData.library,
            spaces: projectData.spaces
        };
        localStorage.setItem('decoration-project-data', JSON.stringify(dataToSave));
        return true;
    } catch (e) {
        console.error('保存数据失败:', e);
        return false;
    }
}

// 从本地存储加载数据
function loadDataFromStorage() {
    const stored = localStorage.getItem('decoration-project-data');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            projectData.projectName = parsed.projectName || "";
            projectData.home = parsed.home || {
                base: [], auxiliary: [], furniture: [], other: []
            };
            projectData.commercial = parsed.commercial || {
                base: [], auxiliary: [], furniture: [], other: []
            };
            projectData.library = parsed.library || [];
            projectData.spaces = parsed.spaces || projectData.spaces;
        } catch (e) {
            console.error('加载数据失败:', e);
        }
    }
}

// 根据项目名称获取项目完整信息
function getProjectInfoByName(projectName) {
    return quickAddExamples.find(item => item.name === projectName) || {
        name: projectName,
        price: 0,
        unit: "项",
        category: "base",
        description: ""
    };
}

// 生成项目ID
function generateProjectId() {
    return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
}

// 检查项目是否重复
function isProjectDuplicate(type, category, space, projectName) {
    const projects = projectData[type][category];
    return projects.some(project => 
        project.space === space && 
        project.name === projectName
    );
}

// 初始化数据
function initializeData() {
    loadDataFromStorage();
    
    // 确保数据结构完整
    if (!projectData.home.other) projectData.home.other = [];
    if (!projectData.commercial.other) projectData.commercial.other = [];
    
    // 确保空间数据完整
    if (!projectData.spaces) {
        projectData.spaces = {
            home: [],
            commercial: []
        };
    }
    
    // 添加默认空间数据
    if (projectData.spaces.home.length === 0) {
        projectData.spaces.home = [
            "客厅", "餐厅", "主卧", "次卧", "儿童房", "书房",
            "厨房", "卫生间", "阳台", "玄关", "走廊", "衣帽间"
        ];
    }
    
    if (projectData.spaces.commercial.length === 0) {
        projectData.spaces.commercial = [
            "前台", "办公区", "会议室", "经理室", "财务室",
            "茶水间", "卫生间", "走廊", "楼梯间", "电梯厅"
        ];
    }
    
    saveDataToStorage();
}

// 立即初始化
initializeData();