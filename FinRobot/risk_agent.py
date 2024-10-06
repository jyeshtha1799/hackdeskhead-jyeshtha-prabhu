import autogen
from autogen.cache import Cache
from finrobot.utils import get_current_date, register_keys_from_json

from finrobot.data_source import (
    FinnHubUtils,
    YFinanceUtils,
    SECUtils,
    FMPUtils,
)
from finrobot.toolkits import register_toolkits

# Read OpenAI API keys from a JSON file
config_list = autogen.config_list_from_json(
    "OAI_CONFIG_LIST",
    filter_dict={"model": ["gpt-4o-mini"]},
)
llm_config = {"config_list": config_list, "timeout": 120, "temperature": 0}

# Register API keys
register_keys_from_json("config_api_keys")

risk_manager = autogen.AssistantAgent(
    name="Risk_Manager",
    system_message="As a Risk Manager, your task is to perform comprehensive risk analysis for a given company, utilizing various data sources and tools. Reply TERMINATE when the task is done.",
    llm_config=llm_config,
)

user_proxy = autogen.UserProxyAgent(
    name="User_Proxy",
    is_termination_msg=lambda x: x.get("content", "") and x.get(
        "content", "").endswith("TERMINATE"),
    human_input_mode="NEVER",
    max_consecutive_auto_reply=10,
    code_execution_config={
        "work_dir": "risk_analysis",
        "use_docker": False,
    },
)

tools = [
    {
        "function": FinnHubUtils.get_company_profile,
        "name": "get_company_profile",
        "description": "get a company's profile information"
    },
    {
        "function": FinnHubUtils.get_company_news,
        "name": "get_company_news",
        "description": "retrieve market news related to designated company"
    },
    {
        "function": FinnHubUtils.get_basic_financials,
        "name": "get_financial_basics",
        "description": "get latest financial basics for a designated company"
    },
    {
        "function": YFinanceUtils.get_stock_data,
        "name": "get_stock_data",
        "description": "retrieve stock price data for designated ticker symbol"
    },
    {
        "function": YFinanceUtils.get_income_stmt,
        "name": "get_income_stmt",
        "description": "get the latest income statement of the company"
    },
    {
        "function": YFinanceUtils.get_balance_sheet,
        "name": "get_balance_sheet",
        "description": "get the latest balance sheet of the company"
    },
    {
        "function": YFinanceUtils.get_cash_flow,
        "name": "get_cash_flow",
        "description": "get the latest cash flow statement of the company"
    },
    # {
    #     "function": SECUtils.get_10k_section,
    #     "name": "get_10k_section",
    #     "description": "get a specific section of a 10-K report from the SEC API"
    # },
    # {
    #     "function": SECUtils.download_10k_filing,
    #     "name": "download_10k_filing",
    #     "description": "download the latest 10-K filing as htm for a given ticker"
    # },
    # {
    #     "function": SECUtils.download_10k_pdf,
    #     "name": "download_10k_pdf",
    #     "description": "download the latest 10-K filing as pdf for a given ticker"
    # },
    # {
    #     "function": FMPUtils.get_competitor_financial_metrics,
    #     "name": "get_competitor_financial_metrics",
    #     "description": "get financial metrics for a company and its competitors"
    # },
    
    # {
    #     "function": FinanceData.get_stock_data,
    #     "name": "get_stock_data",
    #     "description": "retrieve stock price data for designated ticker symbol"
    # },
    # {
    #     "function": FinanceData.get_company_profile,
    #     "name": "get_company_profile",
    #     "description": "get a company's profile information"
    # },
    # {
    #     "function": FinanceData.get_company_news,
    #     "name": "get_company_news",
    #     "description": "retrieve market news related to designated company"
    # },
    # {
    #     "function": FinanceData.get_financial_basics,
    #     "name": "get_financial_basics",
    #     "description": "get latest financial basics for a designated company"
    # },
]
register_toolkits(tools, risk_manager, user_proxy)


# class RiskAnalysisSession:
#     def __init__(self, company):
#         self.company = company
#         self.conversation_history = []
#         self.cache = Cache.disk()

#     def perform_initial_analysis(self):
#         message = f"Perform a comprehensive risk analysis for {self.company} as of {get_current_date()}. Utilize all available tools to gather relevant information, including company profile, news, financial statements, SEC filings, and competitor data. Analyze potential risks and provide a detailed risk assessment report."
#         self._send_message(message)

#     def ask_follow_up_question(self, question):
#         message = f"Follow-up question: {question}"
#         self._send_message(message)

#     def _send_message(self, message):
#         if self.conversation_history:
#             message += " Previous conversation: " + " ".join(self.conversation_history)

#         user_proxy.initiate_chat(
#             risk_manager,
#             message=message,
#             cache=self.cache,
#         )

#         # Get the latest messages from the agent
#         messages = user_proxy.chat_messages[risk_manager]

#         # Collect the last two meaningful messages before "TERMINATE"
#         meaningful_messages = []
#         for msg in reversed(messages):
#             print('msgggg', msg)
#             if "TERMINATE" not in msg['content']:
#                 meaningful_messages.append(msg['content'])
#                 if len(meaningful_messages) == 2:
#                     break

#         # Reverse to maintain the original order
#         meaningful_messages.reverse()

#         # Print and append the meaningful messages to the conversation history
#         for msg in meaningful_messages:
#             print(msg)
#             self.conversation_history.append(msg)

#     def get_conversation_history(self):
#         return self.conversation_history

# if __name__ == "__main__":
#     company = "Apple Inc."
#     session = RiskAnalysisSession(company)
#     session.perform_initial_analysis()

#     # Example of asking a follow-up question
#     follow_up_question = "What are the main financial risks identified?"
#     session.ask_follow_up_question(follow_up_question)

#     # Print the entire conversation history
#     print("Conversation History:", session.get_conversation_history())

class RiskAnalysisSession:
    def __init__(self, company):
        self.company = company
        self.conversation_history = []
        self.cache = Cache.disk()

    def perform_initial_analysis(self):
        message = f"Perform a comprehensive risk analysis for {self.company} as of {get_current_date()}. Utilize all available tools to gather relevant information, including company profile, news, financial statements, SEC filings, and competitor data. Analyze potential risks and provide a detailed risk assessment report."
        self._send_message(message)

    def ask_follow_up_question(self, question):
        message = f"Follow-up question: {question}"
        self._send_message(message)

    def _send_message(self, message):
        if self.conversation_history:
            message += " Previous conversation: " + " ".join(self.conversation_history)

        user_proxy.initiate_chat(
            risk_manager,
            message=message,
            cache=self.cache,
        )

        # Get the latest messages from the agent
        messages = user_proxy.chat_messages[risk_manager]

        # Collect the last two meaningful messages before "TERMINATE"
        meaningful_messages = []
        # for msg in reversed(messages):
        #     # print('msg 1', msg)
        #     if msg['content'] is not None and "TERMINATE" not in msg['content']:
        #         meaningful_messages.append(msg['content'])
        #         if len(meaningful_messages) == 3:
        #             break

        for msg in messages:
            if msg['content'] is not None:
                meaningful_messages.append(msg['content'])
                if "TERMINATE" in msg['content']:
                    break


        # Reverse to maintain the original order
        meaningful_messages.reverse()

        # Print and append the meaningful messages to the conversation history
      
        cleaned_msg = meaningful_messages[0].replace("TERMINATE", "").strip()
        
        with open('meaningful_messages.txt', 'a') as file:
            file.write(cleaned_msg + '\n')


        self.conversation_history.append(cleaned_msg)
        # for msg in meaningful_messages:
        #     # print(msg)
        #     self.conversation_history.append(msg)

    def get_conversation_history(self):
        return self.conversation_history

if __name__ == "__main__":
    company = "NVDIA"
    session = RiskAnalysisSession(company)
    session.perform_initial_analysis()

    while True:
        follow_up_question = input("Enter your follow-up question (or type 'exit' to quit): ")
        if follow_up_question.lower() == 'exit':
            break
        session.ask_follow_up_question(follow_up_question)

    # Print the entire conversation history
    print("Conversation History:", session.get_conversation_history())