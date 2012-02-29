package test.com.phonegap.util;

import com.phonegap.util.*;
import junit.framework.TestCase;
import org.mockito.Mockito;

import com.phonegap.util.NetworkSuffixGenerator;

public class NetworkSuffixGeneratorTest extends TestCase {
	private NetworkSuffixGenerator generator = new NetworkSuffixGenerator();

	public void test_should_generate_network_suffix_for_MDS(){
		NetworkSuffixGenerator spy = spyOnGenerator(Boolean.TRUE, Boolean.FALSE, Boolean.FALSE);

		String suffix = spy.generateNetworkSuffix();

		assertEquals(";deviceside=false", suffix);
	}

	public void test_should_generate_network_suffix_for_BES_when_both_available(){
		NetworkSuffixGenerator spy = spyOnGenerator(Boolean.TRUE, Boolean.FALSE, Boolean.TRUE);
		((NetworkSuffixGenerator) Mockito.doReturn(";interface=wifi").when(spy)).createWifiSuffix();

		String suffix = spy.generateNetworkSuffix();

		assertEquals(";deviceside=false", suffix);
	}

	public void test_should_generate_network_suffix_for_TCP(){
		NetworkSuffixGenerator spy = spyOnGenerator(Boolean.FALSE, Boolean.FALSE, Boolean.TRUE);
		((NetworkSuffixGenerator) Mockito.doReturn(Boolean.TRUE).when(spy)).hasTCPCoverage();
		((NetworkSuffixGenerator) Mockito.doReturn(";interface=wifi").when(spy)).createWifiSuffix();

		String suffix = spy.generateNetworkSuffix();

		assertEquals(";deviceside=true;interface=wifi", suffix);
	}

	private NetworkSuffixGenerator spyOnGenerator(Boolean hasBESCoverage, Boolean hasBISCoverage, Boolean hasTCPCoverage) {
		NetworkSuffixGenerator spy = (NetworkSuffixGenerator) Mockito.spy(generator);
		((NetworkSuffixGenerator) Mockito.doReturn(hasTCPCoverage).when(spy)).hasTCPCoverage();
		((NetworkSuffixGenerator) Mockito.doReturn(hasBISCoverage).when(spy)).hasBISCoverage();
		((NetworkSuffixGenerator) Mockito.doReturn(hasBESCoverage).when(spy)).hasBESCoverage();

		return spy;
	}

	public void test_should_generate_network_suffix_for_BIS(){
		NetworkSuffixGenerator spy = spyOnGenerator(Boolean.FALSE, Boolean.TRUE, Boolean.FALSE);

		String suffix = spy.generateNetworkSuffix();

		assertEquals(";deviceside=false;ConnectionType=mds-public", suffix);
	}
}
