const BASE_URL = "http://203.115.11.236:10155/SalesTrackAppAPI/api/v1";


const ENDPOINTS = {
  AUTHENTICATE: "/Account/Authanticate",
  GET_APP_VERSION: "/Admin/GetAppVersion",
  GET_APP_MAINTENANCE: "/Admin/GetAppMaintenance",
  CHECK_MAINTENANCE: "/Admin/GetAppMaintenance",
  PROFILE_DETAILS: "/Account/GetAgentProfile",
  MDRT_PROFILE: "/Mdrt/GetPersonalMDRT",
  ISLANDRANK: "/Mdrt/GetIslandRankMDRT",
  BRANCHRANK: "/Mdrt/GetBranchRankMDRT",
  TEAMRANK: "/Mdrt/GetRegionalRankMDRT",
  TOTRANK: "/Mdrt/GetTOTRankMDRT",
  COTRANK: "/Mdrt/GetCOTRankMDRT",
  PERSONAL_MDRT: "/Mdrt/GetPersonalMDRT",
  LIFE_MEMBER_MDRT: "/Mdrt/GetLifeMemberMDRT",
  POLICY_COUNT: "/PolicyDetail/GetInforceLapsCount",
  POLICY_DETAILS:"/PolicyDetail/GetPolicyDetails",
  ACTUAL_KPI_VALUES: "/DashBoard/GetAgentKPIs",
  ACTUAL_INCOME_COMMISION_VALUE: "/DashBoard/GetAgentMonthlySalesIncome",
  SET_TARGET: "/DashBoard/SetTargets",
  GET_TARGET: "/DashBoard/GetSettedTarget",
};

export { BASE_URL, ENDPOINTS };
